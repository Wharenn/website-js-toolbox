# Template

Insert DOM content using a template filled by data from an object or JSON from a remote call.

## Usage

Template works in three parts:
* An handlebars template 
* A trigger (link, button or script)
* An anchor element the resulting content will be placed according to.

```html
<!-- Template -->
<script id="demo-template" type="text/x-handlebars-template">
    <div>
        <b>{{this.name}}</b>
        <div>
            <small>{{this.description}}</small>
        </div>
    </div>
</script>

<!-- Anchor Element -->
<div id="demo-anchor">
    <!-- This block will receive the template filled with data from the URL -->
</div>
```

### Usage with DOM

Template can be triggered automatically from the DOM content with:

```javascript
Template.attachToDOM();
```

All elements with `data-template-trigger` will instanciate the Template behavior.

```html
<!-- Trigger -->
<a href="#" 
    data-template-trigger
    data-template-id="demo-template"
    data-anchor-id="demo-anchor"
    data-anchor-type="child"
    data-data-url="/path/to/data">
    Load block
</a>
```

### Usage with script

Template can also be triggered through script.

```javascript
// Data must be fetched before using template
const data = {
    name: 'Johnny',
    description: 'An old friend',
};

const templateElement = document.getElementById('...');
const anchorElement = document.getElementById('...');

Template.apply(
    templateElement,
    data,
    anchorElement,
    'child',
    (addedElements) => {
        // This optionnal callable is executed when the content has been added. Added nodes are passed as parameter.
    }
);
```

## Data Source

Template can takes its source data an JSON which can be retrieved from the existing document or fetched from an url.

### Source in document

JSON data isset in an element content:
```html
<div id="demo-template-data">
    { 
        "name": "Johnny Johnson",
        "description": "Such a John"
    }
</div>
```

Data element id must be passed in the `data-data-id` attribute of the trigger.

```html
<a href="#" 
    data-template-trigger
    data-data-id="demo-template-data"
    ...>
    Load data
</a>
```

### Source from an URL

URL must be passed in the `data-data-ul` attribute of the trigger.

```html
<a href="#" 
    data-template-trigger
    data-data-url="https://foo.bar/path/to/data"
    ...>
    Load data
</a>
```

## Managing placement with the anchor

The final content will be placed according to the anchor element, whose id is passed as a `data-anchor-id` trigger attribute.

The position according to the anchor must be passed as `data-anchor-type` trigger attribute.

Valid positions are:

* `child`: the content will be placed as child of the anchor
* `before`: the content will be placed before the anchor, and they will share the same parent element.
* `after`: the content will be placed after the anchor, and they will share the same parent element.
