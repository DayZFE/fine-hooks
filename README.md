# fine-hooks

> a simple tool to help handle callback and effect

### more efficient to schedule

## by just only four apis

```typescript
import {
  createService,
  useBindRef,
  useSafeCallback,
  usePartialEffect,
} from "fine-hooks";

// declare a service
const SomeService = createService(function SomeService() {
  const [name, setName] = useState("test");
  return {
    name,
    setName,
  };
});

// SomeService.useInject instead of useContext
// it throw error when dependency not provided
function Test() {
  const data = SomeService.useInject();
  return <div>{data.name}</div>;
}

export default function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  // ref bind with a
  const aR = useBindRef(a);

  // useSafeCallback
  // ! useSafeCallback only dispatch props, never receive result !
  const cb = useSafeCallback(
    () => {
      console.log(a);
      throw new Error("some error");
    },
    [a],
    // delay/debounce time
    1000,
    // if debounce, otherwise delay when falsy
    true,
    (err) => {
      // some error
      console.log(err.message);
    }
  );

  // usePartialEffect
  usePartialEffect(
    ([bVal], [preBVal]) => {
      console.log(a, bVal, preBVal);
      throw new Error("some error");
    },
    [a],
    [b] as const,
    true,
    (err) => {
      // some error
      console.log(err.message);
    }
  );
  return (
    <div className='App'>
      <input value={a} onChange={(e) => setA(e.target.value)} />
      <input value={b} onChange={(e) => setB(e.target.value)} />
      <SomeService.Provider>
        <Test />
      </SomeService.Provider>
    </div>
  );
}
```
