// @flow
import util from 'util.js';
import type {Context} from 'types.js';
import Ast from 'js/jsast/ast.js';
import type {JsAst} from 'js/jsast/ast.js';

const _pattern = (schema: JsonSchema, symbol: string, context: Context): JsAst => {
  const {pattern} = schema;
  if (pattern) {
    const check = Ast.If(
      Ast.Unop.Not(Ast.Call(
        Ast.PropertyAccess(symbol, 'match'),
        Ast.Literal(`/${pattern}/`),
      )),
      context.error(),
    );
    return util.typeCheck('string', symbol, check);
  } else {
    return Ast.Empty;
  }
};

export default _pattern;
