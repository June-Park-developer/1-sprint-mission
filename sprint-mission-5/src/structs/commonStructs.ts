import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  enums,
  nonempty,
  size,
  refine,
} from 'superstruct';

const positiveInteger = refine(integer(), 'PositiveInteger', (value) => value >= 1);
const positiveOrZeroInteger = refine(integer(), 'PositiveInteger', (value) => value >= 0);

const positiveIntegerString = coerce(positiveInteger, string(), (value) => parseInt(value));
const positiveOrZeroIntegerString = coerce(positiveOrZeroInteger, string(), (value) =>
  parseInt(value),
);
const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});

export const PageParamsStruct = object({
  page: defaulted(positiveIntegerString, 1),
  pageSize: defaulted(positiveIntegerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(size(string(), 2, 20)),
});

export const PageParamsWithoutKeywordStruct = object({
  page: defaulted(positiveIntegerString, 1),
  pageSize: defaulted(positiveIntegerString, 10),
  orderBy: optional(enums(['recent'])),
});

export const CursorParamsStruct = object({
  cursor: defaulted(positiveOrZeroIntegerString, 0),
  limit: defaulted(positiveIntegerString, 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(nonempty(string())),
});
