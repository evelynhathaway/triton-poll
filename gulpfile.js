const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const groupmq = require("gulp-group-css-media-queries");

const STYLE_SOURCES = [
    "./public/**/*.css",
];

function prefixStyles() {
    return gulp.src(STYLE_SOURCES, {base: "./"})
        .pipe(plumber())
        .pipe(postcss([
            autoprefixer({
                cascade: false,
            }),
        ]))
        .pipe(groupmq())
        .pipe(gulp.dest("."));
}
exports.prefixStyles = prefixStyles;

exports.default = gulp.series(prefixStyles);
