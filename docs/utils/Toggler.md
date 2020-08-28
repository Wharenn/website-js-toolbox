# Toggler

DOM-based show/hide block management

## Usage

Toggler is only triggered through DOM data-* instructions.

```javascript
# Apply behavior to the existing document
Toggler.attachToDOM();
```

```html
<a href="#" data-toggle-open="hidden-block">
    Show Hidden Things
</a>
<a href="#" data-toggle-close="hidden-block">
    Hide Hidden Things
</a>
<!-- data-toggle-closed attribute hides the element by default -->
<div data-toggle-closed data-toggle-id="hidden-block">
    Secret things to hide
</div>
```
