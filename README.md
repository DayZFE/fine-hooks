# fine-hooks

> a simple tool give you unified React hooks accessor

### no need to use eslint-plugin-react-hooks any more!!!

our target is to ——

1. use object as dependencies instead of array or set

2. some useful functionality such as usePartialEffect and useBindRef

3. unified hooks accessor

4. SOA to be simple

here is an [example](https://codesandbox.io/s/fine-hooks-jydmd?file=/src/App.tsx):

```typescript
import $ from "fine-hooks";

// declare a service
const SomeService = $.CS(function SomeService() {
  const [name, setName] = $.S("test");
  return {
    name,
    setName,
  };
});

// SomeService.IN instead of useContext
// it throw error when dependency not provided
function Test() {
  const data = SomeService.IN();
  return <div>{data.name}</div>;
}

// useEveryThing by $
export default function App() {
  const [a, setA] = $.S("");
  const [b, setB] = $.S("");
  // object instead of array
  const text = $.M({ a, b }, (res) => res.a + res.b);
  const ab = $.M({ a, b });
  // ref bind with a state
  // otherwise use $.R
  const aP = $.BR(a);
  // useCallback, same as Memo
  // cb's type is (name:string)=>void
  const cb = $.C({ a, b }, (res, name: string) => {
    console.log(name, res.a, res.b);
  });
  // useEffect
  // third prop means ignore the first effect process
  $.E(
    { cb },
    (res) => {
      res.cb("changed");
    },
    true
  );

  // useLayoutEffect
  $.LE({ a }, (res) => {
    console.log(res.a);
  });
  $.E({ ab }, (res) => {
    console.log(res.ab, aP.current);
  });
  // usePartialEffect
  // take effect only when first prop change
  $.PE({ a }, { b }, (res, rel) => {
    console.log("partial", res, rel);
  });
  return (
    <div className='App'>
      <input value={a} onChange={(e) => setA(e.target.value)} />
      <input value={b} onChange={(e) => setB(e.target.value)} />
      {text}
      <SomeService.P>
        <Test />
      </SomeService.P>
    </div>
  );
}
```
