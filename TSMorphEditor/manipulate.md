# getReplacedText

```ts
const replacedText = getReplacedText(
  `let x = [1]`,
  `/*x*/let x = [/*0, */1]//`,
  `let x = [2]`
)

console.log(replacedText)
```

result:

```ts
/*x*/let x = [/*0, */2]//
```
