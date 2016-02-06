# ASP.NET MVC + Webpack + Hapi + SASS + React + HMR

> You MUST to know the basis about Webpack, ES6 and ESLint to use this project or
you can clone it and follow this README to start learning about it.

## What this project do?

- It's an ASP.NET MVC 5 Project.
- All NuGet packages related to JavaScript and CSS have been removed.
- All the frontend dependencies have been installed using `npm`.
- It have a small `npm` project inside `Content` folder.
- The module bundling works with `webpack`.
- Webpack creates the bundles inside `Content/bundles` directory.
- With razor we can link the bundles from `Content/bundles` directory.
- Webpack creates a small proxy server with hapijs to serve the bundles in developer mode.
- The Hot Module Replacement plugin, reload (and transpile) changes to the browser when they're changed and saved.
- ESLint it's running every moment to check code errors.

## NuGet packages removed from project

All this unnecesary NuGet packages have been removed, we don't need it anymore and in case you do, just run `npm install <package> --save-dev`.

- bootstrap
- jQuery.Validation
- Microsoft.jQuery.Unobtrusive.Validation
- jQuery.Validation
- jQuery
- Respond
- Modernizr

## Directory structure

All the work it's done within the `Content` directory.

```
\---Content
    |   .babelrc
    |   .editorconfig
    |   .eslintignore
    |   .eslintrc
    |   package.json
    |   webpack-dev-server.js
    |   webpack.config.js
    |
    +---bundles
    |
    \---src
        +---entries
        |       home.js
        |       
        \---styles
            |   core.scss
            |   _base.scss
            |   _mixins.scss
            |   
            +---entries
            |       home.scss
            |       
            \---vendor
                    _colors.scss
                    _normalize.scss
```

- `src` folder contains the source, all the project entries and styles that can be configured in `entry` section of `webpack.config.js` file.
- `bundles` is the directory where the bundles will be generated.
- `.babelrc` it's the `babel` configuration file to transpile ES6 code to ES5.
- `.editorconfig` is the configuration for [editorconfig](http://editorconfig.org) (in case you use it and you should).
- `.eslintignore` it's the ESLint ignoring list.
- `.eslintrc` it's the ESLint configuration file.
- `webpack-dev-server.js` creates a proxy trough your ASP.NET MVC application and execute webpack in developer mode to generate the output assets.
- `webpack.config.js` it's the `webpack` configuration file.

## Workflow

1.- Open Visual Studio project and inmediatly hit `run`.

2.- [Disable `browser link` in case it's enabled](http://stackoverflow.com/a/23140874/1301872). It's just anoying.

3.- Once the project it's runnig up copy used port from the url.

4.- Open the windows console or powershell and navigate to `Content` directory.

5.- Run the command `npm start -- --port=<copied port>` to start `webpack-dev-server`.

6.- You should see an output like this in the console:

```sh
λ npm start -- --port=51476

> aspnet-mvc-webpack-proxy-assets@0.1.0 start C:\Users\<user>\Documents\Visual Studio 2015\Projects\aspnet-mvc-webpack-proxy-assets\Content
> babel-node ./webpack-dev-server.js "--port=51476"

Server running on http://localhost:6789
webpack built a80866ca4b28aeffcbcb in 11635ms
```

7.- Now open `http://localhost:6789` in the browser and enable the developer tools.

8.- You can see in the dev-tools console this message `[HMR] Waiting for update signal from WDS... [HMR] connected`, that means the Webpack Dev Server it's runnig with the Hot Module Replacement plugin.

At this point you can start modifying the code within `src` folder and `webpack` will handle all the changes to re-generate the bundles. It will also check for errors with ESLint and display them on both consoles, and sometimes in your face.

![LOL](/.images/in-your-face.png)

Most of the times webpack will try to re-generate the bundles without the need of reload the page, if not, webpack will let you know it and you just need to press the F5 key...

![Webpack message](/.images/hmr-warning.png)

## What dependencies are added?

- [jquery@2.2.0](https://www.npmjs.com/package/jquery)
- [bootstrap@3.3.6](https://www.npmjs.com/package/bootstrap)
- [font-awesome@4.5.0](https://www.npmjs.com/package/font-awesome)

Webpack will help you to expose global variables like `$`, `jQuery` and `window.jQuery` to use it with modules, but **THEY WILL NOT BE IN THE GLOBAL SCOPE**.

```javascript
{
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}
```

## ESLint support

[ESLint](eslint.org) it's configured with the [`airbnb`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) preset and sets `$` and `jQuery` variables as globals.

```json
{
  "extends": "airbnb",
  "globals": {
    "$": true,
    "jQuery": true
  }
}
```

The code review runs everytime you save a file, so it will display information in the browser and both consoles if something weird happened with your code.

You can run the linter manually with the following command `npm run lint`.

## Vendor chuncks

All the third party dependencies will be bundled in one big (not so much) `vendor.js` file thanks to the `Commons Chunk` plugin.

```javascript
{
    new webpack.optimize.CommonsChunkPlugin(
      'vendor', '[name].js'
    )
}
```

All the remained entries will be bundled according to the `output.filename` section of the `webpack.config.js` file.

## Generate bundles ready for production

Yes, you can, simply run `npm run build` and the `bundles` folder will apear with all the chuncks, _JavaScript files_, _CSS stylesheets_, _woff_, _ttf_, _svg_ and _eot_ fonts with _cool random names_ and more!

JavaScript and CSS files will have a source map file, they will be uglifyied and all the `debug` and `console.log` functions will be removed.

## Stripping unwanted code

Thanks to [Yahoo!](https://github.com/yahoo) for this simple but amazing loader: [`strip-loader`](https://github.com/yahoo/strip-loader). With it we can exclude unwanted functions like `debug` or `console.log`, I know, ESLint could warn us, but in case we forgot to remove someones here is how we can just drop out of our code.

### A little note about `strip-loader`

Beware of functions like this: `$('#learn-more').click(() => console.log('http://asp.net'));`, the console function it will not be removed, webpack is so smart that it will be transpile the code like this:

```javascript
$("#learn-more").click(function(){return console.log("http://asp.net")});
```

But if instead you use the code as follows

```javascript
$('#learn-more').click(() => {
  console.log('http://asp.net');
  window.open('http://asp.net', '_blank');
});
```

`strip-loader` will remove the `console.log`;

```javascript
$("#learn-more").click(function(){window.open("http://asp.net","_blank")});
```
