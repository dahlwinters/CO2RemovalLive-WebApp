const path = require("path")
const VueLoaderPlugin = require("vue-loader")
const VuetifyLoaderPlugin = require("vuetify-loader")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

let mode = "development";

let module_info = {
    rules: [
        {
            test: /\.vue$/,
            loader: "vue-loader"
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: file => (
                /node_modules/.test(file) &&
                !/\.vue\.js/.test(file)
            )
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                "vue-style-loader",
                "css-loader"
            ]
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
            ],
        }
    ]
};

let plugins = [
    // make sure to include the plugin for the magic
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin({
        /**
         * This function will be called for every tag used in each vue component
         * It should return an array, the first element will be inserted into the
         * components array, the second should be a corresponding import
         *
         * originalTag - the tag as it was originally used in the template
         * kebabTag    - the tag normalised to kebab-case
         * camelTag    - the tag normalised to PascalCase
         * path        - a relative path to the current .vue file
         * component   - a parsed representation of the current component
         */
        match(originalTag, { kebabTag, camelTag, path, component }) {
            if (kebabTag.startsWith("core-")) {
                return [camelTag, `import ${camelTag} from "@/components/core/${camelTag.substring(4)}.vue"`]
            }
        }
    })
];

let output = {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist")
};

let optimization = {
    runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
    }
};

module.exports = [
    {
        mode,
        module: module_info,
        plugins,
        entry: {
            server: "./server.js"
        },
        output,
        optimization,
        node: {
            global: true,
            __filename: true,
            __dirname: true,
        },
    },
    {
        mode,
        module: module_info,
        plugins,
        entry: {
            client: "./app.js",
        },
        output,
        optimization,
        devServer
    }
]
