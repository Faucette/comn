var task = require("@nathanfaucett/task"),
    jshint = require("gulp-jshint"),
    jsbeautifier = require("gulp-jsbeautifier");


task("jsbeautifier", "beautifier js files", task.parallel(
    function taskfile() {
        return (
            task.src("./taskfile.js")
            .pipe(jsbeautifier())
            .pipe(task.dest("."))
        );
    },
    function src() {
        return (
            task.src("./src/**/*.js")
            .pipe(jsbeautifier())
            .pipe(task.dest("./src"))
        );
    },
    function test0() {
        return task.src("./test/test0/**/*.js").pipe(jsbeautifier()).pipe(task.dest("./test/test0"));
    },
    function test1() {
        return task.src("./test/test1/**/*.js").pipe(jsbeautifier()).pipe(task.dest("./test/test1"));
    },
    function test() {
        return task.src("./test/index.js").pipe(jsbeautifier()).pipe(task.dest("./test"));
    }
));

task("jshint", "run jshint", function jsh() {
    return (
        task.src([
            "./taskfile.js",
            "./src/**/*.js",
            "./test/index.js"
        ])
        .pipe(jshint({
            es3: true,
            unused: true,
            curly: true,
            eqeqeq: true,
            expr: true,
            eqnull: true,
            proto: true
        }))
        .pipe(jshint.reporter("default"))
    );
});

task("default", task.series(
    task("jsbeautifier"),
    task("jshint")
));