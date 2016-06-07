# Paparazzimg

> Trouble finding the ideal image sizes for responsive & fluid figure containers ? This simple JavaScript library will compute the optimal thumbnail dimensions for a given flexible HTML tag.

## Installation

For the moment, please install the library manually. I'll add NPM later.

So, for now you should download the latest release, and simply import it in an HTML view, using an ordinary `<script type="text/javascript" src="paparazzimg.min.js"></script>`.

The built & minimized library can be found in `./build/paparazzimg.min.js`.

## Why is it useful?

Responsive websites require fluid images, which means that these images should grow/shrink according to the different viewport breakpoints.

I many cases, our development team at [WhiteCube](http://www.whitecube.be/) had to face the same problem: which is the perfect size for that image, knowing it will be resized _this_ way on tablets, but _that_ way on mobile phones ?

### The problem

Let's say we have this HTML mark-up:

```html
<article class="news">

      <header class="news__head">
            <h1 class="news__title">Don't drink bleach</h1>
            <p class="news__date">Published <time class="news__time" datetime="2016-06-06T12:13:47Z">06.06.2016</time></p>
            <a href="#url" class="news__link">Read more about "Don't drink bleach"</a>
      </header>

      <figure class="news__thumbnail">
            <img src="../src/to/img.jpg" alt="Little boy drinking bleach. He could die." class="news__img">
      </figure>

      <div class="news__preview">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe dignissimos doloribus eaque in nostrum enim debitis quibusdam. Debitis, aliquid, quo commodi esse libero iure temporibus quibusdam nostrum, assumenda, accusantium ab...</p>
      </div>

</article>
```

As you can see, this macabre article contains a `<figure>`, containing an `<img>`. The SCSS for this article could be something like this:

```SCSS
.news{
      width: 400px;
      float: left;

      & + &{
            margin-left: 20px;
      }

      &__thumbnail{
            width: 100%;
            height: 200px;
            position: relative;
            overflow: hidden;

            @media screen and (max-width: 1024px){
                  height: 100px;
            }

            @media screen and (max-width: 768px){
                  height: 400px;
            }

            @media screen and (max-width: 540px){
                  height: 180px;
            }
      }

      &__img{
            display: block;
            position: absolute;
            width: 100%;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
      }
}

```

Of course, this is a quick example, and probably not the smartest one. In case you're wondering why all these CSS rules on `.news__img`, it is a CSS trick for centring an element vertically & horizontally. For more info, take a look at this [article by Stephen Shaw](https://www.smashingmagazine.com/2013/08/absolute-horizontal-vertical-centering-css/).

So, what we're doing here is positioning an image inside a responsive container, which will drastically change its shape according to the different declared media-queries. This means we should probably worry about the initial dimensions of the image:

- Will it always fit perfectly in its container?
- Will it not be too large, in order to be loaded quickly everywhere?

One way to do so is by hiding some parts of the image when we don't need them, using `overflow: hidden` on the image's container, and calculate the image's ideal dimensions, knowing these breakpoints.

### Our solution

Don't fight with unnecessary headaches, we've got you covered. This Javascript library will track the image's container (`<figure class="news__thumbnail">`) and compute everything you want to know by recording all useful data during the `window.addEventListener('resize')` event.

It does not require jQuery or any other external library.

## How to use

The following steps can be performed directly in the browser's Javascript console.

### Register the tracked containers

First, add one _(or many)_ tracked element. In the example from above, we would define a tracker like this (but you could add as many trackers as you want):

```javascript
paparazzimg.track( document.getElementsByClassName('news__thumbnail')[0] );
```

The library will use the element's identifier in its reports. If the element does not have an `id`, we'll create one for you.


### Resize the viewport

Now, of course, you'll have to show all the different dimensions and states the container will have. To do so, **resize the browser's viewport smoothly**, so the library can track every shape the container will adopt.

### Get the results

Al right, we've tracked the different states our `<figure>` will have. Now display the tracking reports:

```javascript
paparazzimg.release();
```
Or, optionally, the report only for one tracked item:

```javascript
//    Assuming figure1 is the tag's identifier (given or generated by the library)
paparazzimg.release( 'figure1' );
```

## The results

`paparazzimg.release()` will return a Javascript object, similar to this one:

```javascript
{
      figure: {
            count: 225, // Number of tracked window resizes
            extremum: {
                  height: {
                        max: 266, // Figure's maximal height, in px.
                        min: 266  // Figure's minimal height, in px.
                  },
                  width: {
                        max: 268,
                        min: 108
                  },
                  ratio: {    // Ratios are calculated based on (width/height)
                        max: 1.0075187969924813,
                        min: 0.40601503759398494
                  }
            },
            optimal: {
                  static: {
                        height: 266,
                        width: 268
                  },
                  fluidWidth: {
                        height: 661,
                        width: 268
                  },
                  fluidHeight: {
                        height: 266,
                        width: 268
                  }
            }
      },
      figure2: {
            // ...
      },
      // ...
}

```

Let's take a close look to `figure.optimal`. This object contains 3 entries you could use when deciding which image dimensions your website will need.

### Static

These dimensions define the minimal size the image should have if **it's not fluid**. It could be the case with the following CSS:

```css
img{
      width: 400px; // Just for this example
      height: 120px; // Idem
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -60px 0 0 -200px;
}
```

### Fluid Width

The dimensions the image should have when it will resize itself according to the container's width.

```css
img{
      width: 100%;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
}
```

### Fluid Height

The dimensions the image should have when it will resize itself according to the container's height.

```css
img{
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
}
```

## What's next ?

- Generating image blueprints ?
- Exporting data ?
- Maybe a simple Chrome Extension ?

## Contributions

Feel free to contribute, but please respect the coding conventions.

Thank you !