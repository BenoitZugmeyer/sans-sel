sans-sel
========

[![Build status](https://travis-ci.org/BenoitZugmeyer/sans-sel.svg?branch=master)](https://travis-ci.org/BenoitZugmeyer/sans-sel)

*sans-sel* is a small but powerful library to help you write modular, reusable and maintainable CSS in JavaScript.

Features
--------

- Style inheritance
- Parametric style mixins
- Most CSS features available (pseudo classes, pseudo elements, media queries)
- Framework agnostic, no dependency
- Universal JS capable
- 2KB minified + gzipped

Getting started
---------------

*sans-sel* is distributed as a single UMD file with no dependency.

Two choices:

- if you are using a bundler (ex: Webpack, Browserify, Rollup...), install it via `npm install sans-sel` ;
- else, download it from the [Github release page](https://github.com/BenoitZugmeyer/sans-sel/releases) and include it with a `<script>` tag (will expose a global `sansSel` variable) or load it with a AMD loader.

Dead simple example:

```js
// Create a root namespace
const styles = sansSel();

// Define some CSS rules
styles.addRules({

  // "button" is the rule name
  button: {
    border: "1px solid #888",
    backgroundColor: "#ccc",

    // Here is a pseudo class
    hover: {
      backgroundColor: "#ddd"
    }
  }
});

const button = document.createElement("button");

// Apply the rule to an element by rendering a className
button.className = styles("button");

document.body.appendChild(button);
```

API
---

- [`sansSel(...)`](#api-create) ∼ create a *sans-sel* object
- [`sansSelObject.namespace(...)`](#api-namespace) ∼ create a *sans-sel* object inheriting from the current one
- [`sansSelObject.addRule(...)`](#api-rule) ∼ define a rule
- [`sansSelObject.addTransform(...)`](#api-transform) ∼ define a transform
- [`sansSelObject(...)`](#api-render) ∼ render specified rules

### <a name="api-create"></a> `sansSel({ name: "", backend: defaultBackend }={})`

Create a root *sans-sel* object. A *sans-sel* object is a function with some extra methods. You can start by defining [transforms](#api-transform) and [rules](#api-rule), then [call it](#api-render) to get rendered rules.

`name` is optional, but you can't create multiple *sans-sel* object with the same name. You probably don't need multiple root *sans-sel* objects in one project: you should use the [namespace method](#namespace) instead.

`backend` is also optional. It defaults to a simple backend rendering the rules into a private DOM stylesheet injected in the document head. You can easily write your own backend to change this behavior: a backend is only a function that will be called with a string representing a CSS rule as argument.

For example, you could want to render your components on the server side (isomorphic, universal, whatever you call it):

```js
const styleSheetContent = "";

function isomorphicBackend(rule) {
  styleSheetContent += rule;
}

const styles = sansSel({ backend: isomorphicBackend });

// render your components ...

// ... then print styleSheetContent between <style> tags
```

### <a name="api-namespace"></a> `sansSelObject.namespace(name)`

Create a *sans-sel* object inheriting from the current one.

The `name` is mandatory and should be unique among other namespaces created by the current *sans-sel* object. If you'll use the new object to style a component, you could use the component name as a namespace name.

It returns the newly created *sans-sel* object.

The new *sans-sel* object inherits rules and transforms from the parent ones. A rule can inherit from another rule defined in the current *sans-sel* object or any of its parent with the `inherit` property. Example:

```js
const root = sansSel();

root.addTransform("darkBackground", {
  backgroundColor: "#333",
  color: "#fff"
});

root.addRule("button", {
  border: "none"
});

// Elsewhere...

const styles = root.namespace("DarkButton");

styles.addRule("button", {
  inherit: "button",
  darkBackground: true
});

// equivalent to
styles.addRule("button", {
  border: "none",
  backgroundColor: "#333",
  color: "#fff"
});
```

### <a name="api-rule"></a> `sansSelObject.addRule(name, declarations)`

### `sansSelObject.addRules({ [name]: declarations ... })`

Define a rule or a set of rules.

`name` is a string identifying the rule and should be unique inside the *sans-sel* object (root or namespace).

`declarations` is a plain object. If a property value is an object, it will be treated as a pseudo class or a media query. Else, it will be treated as a CSS property. You can specify fallback values by using an array.

It returns the current *sans-sel* object.

To allow a more concise syntax, pseudo-classes will be automatically prefixed by a double colon, and pseudo-elements starting with a dollar sign will be prefixed by two double colons.

Example:

```js
styles.addRule("button", {
  // property
  color: "red",

  // property with fallback values
  display: ["flex", "-ms-flex", "inline"],

  // pseudo class
  hover: {
    color: "blue"
  },

  // pseudo element
  $firstLetter: {
    color: "red"
  },

  // media query
  "@media only screen": {
    color: "green"
  }
});
```

### <a name="api-transform"></a> `sansSelObject.addTransform(name, definition)`

### `sansSelObject.addTransforms({ [name]: definition ... })`

Define a transform or a set of transforms.

`name` is a string identifying the transform and should be unique inside the *sans-sel* object (root or namespace).

`definition` is either a plain object or a function returning a plain object. The transform will be triggered when a rule contains a property name equal to the transform name.

It returns the current *sans-sel* object.

If the definition is a function, it will be called with the property value as argument. If the returned value is a plain object, it will replace the property in the rule declaration, otherwise it will be ignored.

If the definition is invariant, it can be supplied directly as a plain object. This object will replace the property in the rule declaration only if the property value is truthy.

The property replacement is done in-place: property order is conserved.

The object replacing the property can also trigger transforms, but recursion will be avoided (a transform can't be triggered by the object it returns). Transforms are memoized according to the JSON value of the argument.

Transforms are quite flexible and may serve multiple purposes. Common usages includes style mixins and automatic vendor prefixes.

Example of mixin transforms:

```js
// Variable transform
styles.addTransform("foo", (color) => {
  return {
    color: color,
    borderRight: `1px solid ${color}`,
  }
})

// Invariable transform
styles.addTransform("blueFoo", {
  foo: "blue",
})

styles.addRule("link", {
  fontWeight: "bold",
  blueFoo: true,
})

/* Is equivalent to
.<link> {
  font-weight: bold;
  color: blue;
  border-right: 1px solid blue;
}
*/
```

Example of vendor prefixing transforms:

```js
styles.addTransforms({
  flex(value) {
    return {
      flex: value,
      WebkitFlex: value,
    }
  },

  display(value) {
    if (value === "flex") {
      value = [ "-webkit-flex", "flex" ]
    }
    return { display: value }
  }
})

styles.addRule("root", {
  display: "flex",
  flex: 1,
})

/* is equivalent to:
.<root> {
  display: -webkit-flex;
  display: flex;
  -webkit-flex: 1;
  flex: 1;
}
*/
```

### <a name="api-render"></a> `sansSelObject(...rules)`

Render specified rules.

The `rules` arguments are either rule names or rendered rules coming from another *sans-sel* object. Arguments may be nested in arrays and falsy values are ignored.

It returns an opaque object with a `toString()` method. To apply those rules to an element, simply use the string value of this object as a `className`.

Contrary to standard class name lists, the order matters: rules specified later takes precedence over previous rules.

Applying a rule to an element:

```js
styles.addRule("body", {
  backgroundColor: "rebeccapurple"
});

document.body.className = styles("body");
```

Applying rules to an element conditionally:

```js
styles.addRules({
  base: {
    color: "red"
  },
  blue: {
    color: "blue"
  }
});

function createButton({ isBlue }) {
  const button = document.createElement("button");

  button.className = styles("base", isBlue && "blue");

  return button;
}
```

Passing extra rules to a component:

```js
styles.addRules("base", {
  color: "red"
});

function createButton({ style }) {
  const button = document.createElement("button");

  button.className = styles("base", style);

  return button;
}

// Elsewhere...

otherStyles.addRule("specialButton", {
  color: "green"
});

document.body.appendChild(
  createButton({ style: otherStyles("specialButton") })
);
```

Argument flattening example:

```js
const rules = styles("foo", ["bar", null, ["baz"]]);
// is equivalent to
const rules = styles("foo", "bar", "baz");
```

Hints
=====

Always define rules statically, for example when the JS module is executed. *sans-sel* is "append
only" and won't clear unused styles, so if you add the same rules multiple times, memory will be
leaked and perfs will be degraded.

You can still use standard CSS (ex: to define `@keyframes`) or inline styles (ex: for JS driven
animations).
