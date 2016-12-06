# tslint-msbuild-path

> TsLint formatter that outputs errors in a format msbuild expects so they can be navigatable in visual studio.

The errors reported by tslint in visual studio cannot be quickly navigated to. This formatter outputs the format that msbuild expects so you can navigate to them through the error list and by clicking F8 to jump to the next error.

### grunt-tslint

Basic example that includes all .ts files and excludes any d.ts files.

````js
grunt.initConfig({
    tslint: {
        options: {
            formatter: "tslint-msbuild-path"
        },
        files: {
            ["**/*.ts", "!**.*.d.ts"]
        }
    }
});
````
### Project.csproj

To get grunt to run as part of your visual studio build, you can add the following to your .csproj file

````xml

  <Target Name="GruntBuild" AfterTargets="AfterBuild">
    <Exec Command="npm install" />
    <Exec Command="grunt tslint" />
  </Target>
````
