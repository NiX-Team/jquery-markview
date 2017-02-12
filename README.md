# jQuery Markview

A jQuery Plugin to display markdown in some different ways

## Installation

Install jquery-markview with yarn:

``` bash
yarn add jquery-markview
```

## Usage

Ensure these library is included.

``` json
"dependencies": {
    "d3": "^4.5.0",
    "jquery": "^3.1",
    "marked": "^0.3.6"
}
```

Include `jquery-markview.min.js`, `jquery-markview.min.css` files into the web page.

Create a div applying jQuery plugin `jquery-markview` with config as follows:

``` javascript
$('#jquery-markview').markview({
    style: 'fold',
    loadData: function () {
            return $.Deferred().resolve(
                "# jQuery Markview\nA jQuery Plugin to display markdown in some different ways");
        }
})
```

## Configuration

The config object may contain following options (default values are specified below):

``` javascript
{
    style: 'fold',
    autosize: true,
    width: "100",
    height: "100",
    cellWidth: 250,
    cellHeight: 50,
    loadData: null
}
```
+ **style** is a string key(`"fold"|"tree"`) to decide which way to dispaly the markdown text.
+ **autosize** is a boolean specifying whether auto compute the size of the div.
+ **width** is the width of the div when **autosize** is `false`.
+ **height** is the height of the div when **autosize** is `false`.
+ **celWidth** is the width of the cell when **style** is `"tree"`.
+ **celHeight** is the wheightof the cell when **style** is `"tree"`.
+ **loadData** is a function returning jQuery promise that will be resolved with the markdown text.

