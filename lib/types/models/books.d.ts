export type Data = {
   userId: string;
   id: string;
   title: string;
   subtitle: string;
   publishedDate: Date;
   language: string;
   pageCount: number;
   categories: string[];
   authors: string[];
   industryIdentifiers: string[];
};

type IgnorePrismaBuiltins<S extends string> = string extends S
   ? string
   : S extends ''
   ? S
   : S extends `$${infer T}`
   ? never
   : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;
