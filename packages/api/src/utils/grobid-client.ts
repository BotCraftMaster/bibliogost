/**
 * Клиент для работы с GROBID API
 */
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { z } from "zod";

import { env } from "../env";

export interface GrobidReference {
  authors?: { surname: string; forename: string }[];
  title?: string;
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
  arxiv?: string;
  url?: string;
  publisher?: string;
  publisherPlace?: string;
  type?: "article" | "book" | "chapter" | "webpage";
  rawCitation?: string;
}

export interface CiteprocReference {
  id: string;
  type: "article-journal" | "book" | "chapter" | "webpage";
  author?: { family: string; given: string }[];
  title?: string;
  "container-title"?: string;
  issued?: { "date-parts": [[number]] };
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  PMID?: string;
  PMCID?: string;
  URL?: string;
  accessed?: { "date-parts": [[number, number, number]] };
  publisher?: string;
  "publisher-place"?: string;
}

// Zod схемы для типобезопасного парсинга TEI XML
const TextNodeSchema = z.union([
  z.string(),
  z.object({ "#text": z.union([z.string(), z.number()]) }),
]);

const ForenameSchema = z.union([
  z.string(),
  z.object({
    "#text": z.string(),
    "@_type": z.string().optional(),
  }),
]);

const PersNameSchema = z.object({
  surname: TextNodeSchema.optional(),
  forename: z.union([ForenameSchema, z.array(ForenameSchema)]).optional(),
});

const AuthorSchema = z.object({
  persName: PersNameSchema.optional(),
});

const TitleSchema = z.object({
  "#text": z.string().optional(),
  "@_level": z.string().optional(),
  "@_type": z.string().optional(),
});

const BiblScopeSchema = z.object({
  "#text": z.union([z.string(), z.number()]).optional(),
  "@_unit": z.string().optional(),
  "@_from": z.union([z.string(), z.number()]).optional(),
  "@_to": z.union([z.string(), z.number()]).optional(),
});

const DateSchema = z.object({
  "#text": z.union([z.string(), z.number()]).optional(),
  "@_when": z.union([z.string(), z.number()]).optional(),
  "@_type": z.string().optional(),
});

const ImprintSchema = z.object({
  date: DateSchema.optional(),
  biblScope: z.union([BiblScopeSchema, z.array(BiblScopeSchema)]).optional(),
  publisher: TextNodeSchema.optional(),
  pubPlace: TextNodeSchema.optional(),
});

const IdnoSchema = z.object({
  "#text": z.string().optional(),
  "@_type": z.string().optional(),
});

const RefSchema = z.object({
  "@_target": z.string().optional(),
});

const MonogrSchema = z.object({
  title: z.union([TitleSchema, z.array(TitleSchema)]).optional(),
  author: z.union([AuthorSchema, z.array(AuthorSchema)]).optional(),
  imprint: ImprintSchema.optional(),
});

const AnalyticSchema = z.object({
  title: z.union([TitleSchema, z.array(TitleSchema)]).optional(),
  author: z.union([AuthorSchema, z.array(AuthorSchema)]).optional(),
  idno: z.union([IdnoSchema, z.array(IdnoSchema)]).optional(),
});

const BiblStructSchema = z.object({
  analytic: AnalyticSchema.optional(),
  monogr: MonogrSchema.optional(),
  idno: z.union([IdnoSchema, z.array(IdnoSchema)]).optional(),
  ref: RefSchema.optional(),
  ptr: RefSchema.optional(),
});

const ParsedXMLSchema = z.object({
  biblStruct: BiblStructSchema.optional(),
});

/**
 * Отправляет текст в GROBID для парсинга
 */
export async function parseWithGrobid(
  text: string,
  grobidUrl = env.GROBID_URL,
): Promise<GrobidReference> {
  try {
    const urlMatch = /(https?:\/\/[^\s)]+)/i.exec(text);
    const extractedUrl = urlMatch ? urlMatch[1] : undefined;

    const params = new URLSearchParams();
    params.append("citations", text);
    params.append("consolidateCitations", "1");

    const response = await axios.post(
      `${grobidUrl}/api/processCitation`,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      },
    );

    const result = parseGrobidResponse(response.data);

    if (!result.url && extractedUrl) {
      result.url = extractedUrl;
    }

    return result;
  } catch (error) {
    console.error("GROBID parsing error:", error);
    return {};
  }
}

/**
 * Создает "сырую" цитату из TEI XML для дополнительной обработки
 */
function createRawCitation(xmlString: string): string {
  let processed = xmlString
    .replace(/\/title>/g, "/title>. ")
    .replace(/\/forename>/g, "/forename> ")
    .replace(/\/surname>/g, "/surname> ")
    .replace(/\/persName>/g, "/persName>, ")
    .replace(/\/date>/g, "/date>. ")
    .replace(/\/publisher>/g, "/publisher>, ")
    .replace(/\/pubPlace>/g, "/pubPlace>. ")
    .replace(/unit="volume">/g, 'unit="volume">, vol. ')
    .replace(/unit="issue">/g, 'unit="issue">')
    .replace(/unit="page">/g, 'unit="page">, p. ');

  processed = processed.replace(/<[^>]+>/g, "");

  processed = processed
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'");

  processed = processed
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ")
    .replace(/\s,/g, ",")
    .trim();

  return processed;
}

/**
 * Извлекает текст из TextNode (может быть строкой или объектом с #text)
 */
function extractText(
  node: z.infer<typeof TextNodeSchema> | undefined,
): string | undefined {
  if (!node) return undefined;
  if (typeof node === "string") return node;
  return String(node["#text"]);
}

/**
 * Парсит ответ от GROBID с использованием Zod для типобезопасности
 */
function parseGrobidResponse(data: unknown): GrobidReference {
  const xmlString = typeof data === "string" ? data : String(data);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    parseAttributeValue: true,
  });

  const parsedRaw: unknown = parser.parse(xmlString);
  const parseResult = ParsedXMLSchema.safeParse(parsedRaw);

  if (!parseResult.success || !parseResult.data.biblStruct) {
    return {};
  }

  const biblStruct = parseResult.data.biblStruct;
  const { analytic, monogr } = biblStruct;

  // Извлекаем авторов
  const authors: { surname: string; forename: string }[] = [];
  const authorSource = analytic?.author ?? monogr?.author;

  if (authorSource) {
    const authorList = Array.isArray(authorSource)
      ? authorSource
      : [authorSource];

    for (const author of authorList) {
      const persName = author.persName;
      if (!persName) continue;

      const surname = extractText(persName.surname);
      if (!surname) continue;

      const forenames = persName.forename;
      const forenameList = Array.isArray(forenames)
        ? forenames
        : forenames
          ? [forenames]
          : [];

      const forenameStr = forenameList
        .map((fn) =>
          typeof fn === "object" && "#text" in fn ? fn["#text"] : String(fn),
        )
        .join(" ");

      authors.push({ surname, forename: forenameStr });
    }
  }

  // Извлекаем заголовки
  const getTitleByLevel = (level: string): string | undefined => {
    const titles = analytic?.title ?? monogr?.title;
    if (!titles) return undefined;

    const titleList = Array.isArray(titles) ? titles : [titles];
    const found = titleList.find((t) => t["@_level"] === level);
    return found?.["#text"];
  };

  const titleAnalytic = getTitleByLevel("a");
  const titleMonograph = getTitleByLevel("m");
  const journal = getTitleByLevel("j");

  // Извлекаем год
  const dateWhen = monogr?.imprint?.date?.["@_when"];
  const year = dateWhen ? String(dateWhen) : undefined;

  // Извлекаем biblScope (том, номер, страницы)
  const biblScopes = monogr?.imprint?.biblScope;
  const biblScopeList = Array.isArray(biblScopes)
    ? biblScopes
    : biblScopes
      ? [biblScopes]
      : [];

  let volume: string | undefined;
  let issue: string | undefined;
  let pages: string | undefined;

  for (const scope of biblScopeList) {
    const unit = scope["@_unit"];
    if (unit === "volume") {
      volume = scope["#text"] ? String(scope["#text"]) : undefined;
    } else if (unit === "issue") {
      issue = scope["#text"] ? String(scope["#text"]) : undefined;
    } else if (unit === "page") {
      const from = scope["@_from"] ? String(scope["@_from"]) : undefined;
      const to = scope["@_to"] ? String(scope["@_to"]) : undefined;
      pages = from && to ? `${from}-${to}` : (from ?? to);
    }
  }

  // Извлекаем идентификаторы (DOI, PMID, PMCID, arXiv)
  const idno = analytic?.idno ?? biblStruct.idno;
  let doi: string | undefined;
  let pmid: string | undefined;
  let pmcid: string | undefined;
  let arxiv: string | undefined;

  if (idno) {
    const idnoList = Array.isArray(idno) ? idno : [idno];

    for (const id of idnoList) {
      const idType = id["@_type"]?.toUpperCase();
      const idValue = id["#text"];

      if (idValue && idType) {
        if (idType === "DOI") doi = idValue;
        else if (idType === "PMID") pmid = idValue;
        else if (idType === "PMCID") pmcid = idValue;
        else if (idType === "ARXIV") arxiv = idValue;
      } else if (!doi && idValue) {
        doi = idValue;
      }
    }
  }

  // Извлекаем URL
  const urlFromRef = biblStruct.ref?.["@_target"];
  const urlFromPtr = biblStruct.ptr?.["@_target"];

  let urlFromIdno: string | undefined;
  if (idno) {
    const idnoList = Array.isArray(idno) ? idno : [idno];
    const urlIdno = idnoList.find(
      (id) => id["@_type"] === "url" || id["@_type"] === "URI",
    );
    urlFromIdno = urlIdno?.["#text"];
  }

  // Извлекаем издательство
  const publisher = extractText(monogr?.imprint?.publisher);
  const publisherPlace = extractText(monogr?.imprint?.pubPlace);

  // Определяем тип публикации
  let type: "article" | "book" | "chapter" | "webpage" = "article";
  if (journal) {
    type = "article";
  } else if (titleAnalytic && titleMonograph) {
    type = "chapter";
  } else if (titleMonograph) {
    type = "book";
  }

  const rawCitation = createRawCitation(xmlString);

  return {
    authors: authors.length > 0 ? authors : undefined,
    title: titleAnalytic ?? titleMonograph,
    journal,
    year,
    volume,
    issue,
    pages,
    doi,
    pmid,
    pmcid,
    arxiv,
    url: urlFromIdno ?? urlFromPtr ?? urlFromRef,
    publisher,
    publisherPlace,
    type,
    rawCitation,
  };
}

/**
 * Конвертирует GROBID результат в формат citeproc-js
 */
export function convertToCiteproc(
  grobidRef: GrobidReference,
  id: string,
): CiteprocReference {
  let type: "article-journal" | "book" | "chapter" | "webpage" = "book";
  if (grobidRef.type === "article" || grobidRef.journal) {
    type = "article-journal";
  } else if (grobidRef.type === "chapter") {
    type = "chapter";
  } else if (grobidRef.url) {
    type = "webpage";
  } else if (grobidRef.type === "book") {
    type = "book";
  }

  const citeprocRef: CiteprocReference = {
    id,
    type,
  };

  if (grobidRef.authors && grobidRef.authors.length > 0) {
    citeprocRef.author = grobidRef.authors.map((author) => ({
      family: author.surname,
      given: author.forename,
    }));
  }

  if (grobidRef.title) citeprocRef.title = grobidRef.title;
  if (grobidRef.journal) citeprocRef["container-title"] = grobidRef.journal;
  if (grobidRef.volume) citeprocRef.volume = grobidRef.volume;
  if (grobidRef.issue) citeprocRef.issue = grobidRef.issue;
  if (grobidRef.pages) citeprocRef.page = grobidRef.pages;
  if (grobidRef.doi) citeprocRef.DOI = grobidRef.doi;
  if (grobidRef.pmid) citeprocRef.PMID = grobidRef.pmid;
  if (grobidRef.pmcid) citeprocRef.PMCID = grobidRef.pmcid;
  if (grobidRef.url) citeprocRef.URL = grobidRef.url;
  if (grobidRef.publisher) citeprocRef.publisher = grobidRef.publisher;
  if (grobidRef.publisherPlace)
    citeprocRef["publisher-place"] = grobidRef.publisherPlace;

  if (grobidRef.year) {
    const year = parseInt(grobidRef.year, 10);
    if (!isNaN(year)) {
      citeprocRef.issued = { "date-parts": [[year]] };
    }
  }

  if (grobidRef.url) {
    const today = new Date();
    citeprocRef.accessed = {
      "date-parts": [
        [today.getFullYear(), today.getMonth() + 1, today.getDate()],
      ],
    };
  }

  return citeprocRef;
}
