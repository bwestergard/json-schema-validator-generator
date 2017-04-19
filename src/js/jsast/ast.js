// @flow
/* eslint-disable no-use-before-define */

// Statements
export type JsAst = (
  AssignmentType |
  IfType |
  ReturnType |
  BodyType |
  ForType |
  ForInType |
  EmptyType |
  Function1Type |
  BinopType |
  EmptyType |
  LiteralType |
  CallType |
  UnopType |
  ObjectLiteralType |
  PropertyAccessType
);
type AssignmentType = {
  type: 'assignment',
  variable: LiteralType,
  value: JsAst,
};
export type IfType = {
  type: 'if',
  predicate: JsAst,
  body: JsAst,
  elseBody: JsAst,
};
type ReturnType = {
  type: 'return',
  value: JsAst,
};
export type BodyType = {
  type: 'body',
  body: Array<JsAst>
};
export type ForType = {
  type: 'for',
  init: JsAst,
  condition: JsAst,
  loop: JsAst,
  body: JsAst,
};
export type ForInType = {
  type: 'forin',
  variable: LiteralType,
  iterator: JsAst,
  body: JsAst,
};
type EmptyType = {type: 'empty'};

export type Function1Type = {
  type: 'function1',
  name: LiteralType,
  argument: LiteralType,
  body: JsAst,
};
type BinopType = {
  type: 'binop',
  left: JsAst,
  comparator: string,
  right: JsAst,
};
export type LiteralType = {
  type: 'literal',
  value: string,
};
type CallType = {
  type: 'call',
  fn: LiteralType,
  arg: LiteralType,
};
export type UnopType = {
  type: 'unop',
  op: string,
  child: JsAst,
  style: 'prefix' | 'suffix',
};
export type ObjectLiteralType = {
  type: 'objectliteral',
  object: {[key: string]: JsAst},
};
export type PropertyAccessType = {
  type: 'propertyaccess',
  obj: JsAst,
  property: string,
};

const Function1 = (
  name: LiteralType | string,
  argument: LiteralType | string,
  body: JsAst,
): Function1Type => ({
  type: 'function1',
  name: Literal(name),
  argument: Literal(argument),
  body: Body(body),
});
const _Binop = (comparator: string) => (left: JsAst | string, right: JsAst | string): BinopType => {
  return {
    type: 'binop',
    comparator,
    left: (typeof left === 'string') ? Literal(left) : left,
    right: (typeof right === 'string') ? Literal(right) : right,
  };
};
const Assignment = (variable: LiteralType | string, value: JsAst): AssignmentType => {
  return {
    type: 'assignment',
    variable: Literal(variable),
    value,
  };
};
const If = (predicate: JsAst | string, body: JsAst | string, elseBody: JsAst | string = Empty): IfType => {
  return {
    type: 'if',
    predicate: (typeof predicate === 'string') ? Literal(predicate) : predicate,
    body: Body((typeof body === 'string') ? Literal(body) : body),
    elseBody: Body((typeof elseBody === 'string') ? Literal(elseBody) : elseBody),
  };
};
const Return = (value: JsAst | string): ReturnType => {
  return {
    type: 'return',
    value: (typeof value === 'string') ? Literal(value) : value,
  };
};
const Body = (...body: Array<JsAst>): BodyType | EmptyType => {
  if (body.length === 1 && (body[0].type === 'body' || body[0].type === 'empty')) {
    return body[0];
  } else {
    return {type: 'body', body};
  }
};
const For = (
  init: JsAst,
  condition: JsAst,
  loop: JsAst,
  body: JsAst,
): ForType => ({type: 'for', init, condition, loop, body});
const ForIn = (
  variable: LiteralType | string,
  iterator: JsAst,
  body: JsAst,
): ForInType => ({
  type: 'forin',
  variable: Literal(variable),
  iterator,
  body: Body(body),
});
const Empty = {type: 'empty'};
const Literal = (value: LiteralType | string): LiteralType => {
  if (typeof value === 'string') {
    return {type: 'literal', value};
  } else {
    return value;
  }
};
const Call = (fn: string, arg: string) => {
  return {
    type: 'call',
    fn: Literal(fn),
    arg: Literal(arg),
  };
};
const _Unop = (op: string, style: 'prefix' | 'suffix') => (child: JsAst | string): UnopType => {
  return {
    type: 'unop',
    child: (typeof child === 'string') ? Literal(child) : child,
    op,
    style,
  };
};
const ObjectLiteral = (object: {[key: string]: JsAst}): ObjectLiteralType => {
  return {
    type: 'objectliteral',
    object,
  };
};
const PropertyAccess = (obj: JsAst | string, property: string): PropertyAccessType => {
  return {
    type: 'propertyaccess',
    obj: (typeof obj === 'string') ? Literal(obj) : obj,
    property,
  };
};

export default {
  Function1,
  Binop: {
    Eq: _Binop('==='),
    Neq: _Binop('!=='),
    And: _Binop('&&'),
    Or: _Binop('||'),
    Lt: _Binop('<'),
    Gt: _Binop('>'),
    Lte: _Binop('<='),
    Gte: _Binop('>='),
    Any: _Binop,
  },
  Assignment,
  If,
  Return,
  Body,
  For,
  ForIn,
  Empty,
  Literal,
  Call,
  Unop: {
    Not: _Unop('!', 'prefix'),
    Incr: _Unop('++', 'suffix'),
    Any: _Unop,
  },
  ObjectLiteral,
  PropertyAccess,
  Null: Literal('null'),
  Undefined: Literal('undefined'),
};
