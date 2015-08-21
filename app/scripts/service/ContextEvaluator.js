import typeName from 'type-name';
import vm from 'vm';

export default class ContextEvaluator {
  constructor(context, commander) {
    this._context = vm.createContext(context);
    this._seq = 0;
  }

  getContext() {
    return this._context;
  }

  init() {
    return { type: 'INIT', result: '' };
  }

  evaluate(text) {
    this._seq++;
    var script = vm.createScript(text);
    var result = script.runInContext(this._context);
    if (result && typeof result.then === 'function') {
      result.then((v) => {
        this._context._ = this._context['_'+this._seq] = v;
      });
    } else {
      this._context._ = this._context['_'+this._seq] = result;
    }
    return { type: 'RESULT', result, seq: this._seq };
  }


  complete(text, pos=0) {
    console.log('ContextEvaluator#complete()', text, pos);
    let target = text, rest = '';
    if (pos > 0) {
      target = text.substring(0, pos);
      rest = text.substring(pos);
    }
    let expr = target.split(/[^\w\$\.\[\]]+/).pop();
    let path = expr.split(/[\.\[\]]+/);
    console.log(path);
    let ctx = this._context;
    while (path.length > 1) {
      console.log('ctx=', ctx);
      let p = path.shift();
      ctx = ctx[p];
      if (!ctx) {
        return { text, candidates };
      }
    }
    console.log('ctx=', ctx);
    let word = path[0];
    let candidates = getPropertyNames(ctx)
      .filter((key) => key.indexOf(word) === 0)
      .map((key) => ({
        label: key,
        value: key,
        type: typeName(ctx[key]) || 'Object',
      }));
    let completion = candidates.length === 0 ? '' :
      candidates.map((c) => c.value).reduce((completion, candidate) => {
        for (var i=0; i<completion.length; i++) {
          if (completion[i] !== candidate[i]) {
            return completion.substring(0, i);
          }
        }
        return completion;
      });
    completion = completion.substring(word.length);
    console.log(target + completion + rest, candidates);
    return { text: target + completion + rest, candidates };
  }
}

function getPropertyNames(obj) {
  var names = [];
  for (let k in obj) {
    names.push(k);
  }
  return names;
}
