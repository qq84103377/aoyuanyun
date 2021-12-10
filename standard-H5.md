# H5 设计及开发规范

## 编码规范

### SCSS 规范

#### 缩进/空格/换行规范

-   每个缩进使用 4 个空格，不允许使用 2 个空格 或 tab

    ```
    //正确
    .sample {
        display: flex;
    }
    //错误
    .sample {
      display: flex;
    }
    ```

-   选择器 与 花括号 之间必须包含空格

    ```
    //正确
    .sample {
        display: flex;
    }
    //错误
    .sample{
        display: flex;
    }
    ```

-   每条规则之间必须包含空行

    ```
    //正确
    .sample {
        display: flex;
    }

    .sample1 {
        display: block;
    }
    //错误
    .sample {
        display: flex;
    }
    .sample1 {
        display: block;
    }
    ```

-   属性名与冒号之间不允许包含空格， 冒号与属性值之间必须包含空格

    ```
    //正确
    display: flex;
    //错误
    display:flex
    display : flex
    display :flex
    ```

-   逗号前不允许有空格，逗号后必须跟一个空格

    ```
    //正确
    font-family: Helvetica, Arial
    //错误
    font-family: Helvetica , Arial
    font-family: Helvetica ,Arial
    font-family: Helvetica, Arial
    ```

-   SCSS mixin 的方法参数括号与 { 之间必须包含一个空格, 各参数间必须有一个空格

    ```
    //正确
    @mixin color-box($bg-color: $grey-light, $border-color: $grey) {
        background-color: $bg-color;
        border: 1px solid $border-olor;
    }
    //错误
    @mixin color-box($bg-color:$grey-light,$border-color:$grey) {
        background-color: $bg-color;
        border: 1px solid $border-olor;
    }
    ```

-   '+' '~' '>'选择器前后必须跟一个空格

    ```
    //正确
    .radio-label + .radio-box {

    }
    //错误
    .radio-label+.radio-box {

    }
    ```

-   引用 mixin 和多层嵌套必须有一个空行

    ```
    //正确
    .sample {
        @include color-box;

        margin: 15px;

        &:hover {
          display: block;
        }
    }
    //错误
    .sample {
        @include color-box;
        margin: 15px;
        &:hover {
          display: block;
        }
    }
    ```

-   一组变量的定义，尽量以冒号对齐

    ```
    //推荐
    $link-hover-color        : #29e;
    $hover-color-gray        : #ebebeb;
    $icon-hover-color        : #4d4d4d;
    $btn-hover-color         : #f0f0f0;
    $btn-hover-color-form    : #f9f9f9;
    $btn-hover-color-cancel  : #f63737;
    //不推荐
    $link-hover-color : #29e;
    $hover-color-gray : #ebebeb;
    $icon-hover-color : #4d4d4d;
    $btn-hover-color : #f0f0f0;
    $btn-hover-color-form : #f9f9f9;
    $btn-hover-color-cancel : #f63737;
    ```

-   多个并行选择器使用同一规则，必须换行

    ```
    //正确
    .a,
    .b,
    .c {
        box-sizing: border-box;
    }
    //错误
    .a, .b, .c {
        box-sizing: border-box;
    }
    ```

#### 选择器

-   禁止使用 ID 应用于样式，应该使用 class

    ```
    //正确
    .content {
        display: flex;
    }
    //错误
    #content {
        display: flex;
    }
    ```

-   CSS 选择器中避免标签名

    选择器应该是准确和有语义的 class(类)名，不推荐使用标签选择器。这样会更容易维护, 只需要修改你的标签名，而不是你的 class

    从分离的角度考虑,在表现层中不应该分配 html 标记/语义。

    ```
    //推荐
    .content {
        display: flex;

        > .nav {
            flex: 1;
        }
    }
    //不推荐
    .content {
        display: flex;

        > nav {
            flex: 1
        }
    }
    ```

-   尽量精准的选择

    ```
    //推荐
    .content {
        display: flex;

        > .nav {
            flex: 1;
        }
    }
    //不推荐
    .content {
        display: flex;

        .nav {
            flex: 1
        }
    }
    ```

-   选择器嵌套

    正常的情况下，我们不推荐使用嵌套，如果需要使用嵌套，我们不推荐嵌套超过三层, 如果嵌套超过三层，应该考虑是不是哪里可以使用更精准更语义化的 class。不推荐直接使用 css 的嵌套，而是使用 SCSS 的嵌套。

    ```
    //推荐
    .content {
        display: flex;

        > .nav {
            flex: 1;

            > .item {
                text-align: center;
            }
        }
    }
    //不推荐
    .content .nav .item a {
        text-align: center;
    }
    ```

-   在 CSS 预处理器如 LESS 和 SASS 里 media query 推荐直接在选择器的嵌套中使用，有助于保持媒体查询属于的上下文

    ```
    //推荐
    .content {
        font-size: 1.2rem;

        @media screen and (min-width: 767px) {
            font-size: 1rem;
        }
    }
    //不推荐
    .content {
        font-size: 1.2rem;
    }
    @media screen and (min-width: 767px) {
        .content {
            font-size: 1rem;
        }
    }
    ```

-   属性选择器必须使用双引号

    ```
    //正确
    [class="icon-"] {
        font-size: 1rem;
    }
    //错误
    [class='icon-'] {
        font-size: 1rem;
    }
    ```

#### 属性规范

-   属性定义必须另起一行

    ```
    // 正确
    .selector {
        margin: 0;
        padding: 0;
    }

    // 错误
    .selector { margin: 0; padding: 0; }
    ```

-   属性必须以分号结尾

    ```
    // 正确
    .selector {
        margin: 0;
        padding: 0;
    }
    // 错误
    .selector {
        margin: 0;
        padding: 0
    }
    ```

-   属性值为 0 时，省略单位

    ```
    // 正确
    .box {
        padding: 0;
    }
    // 错误
    .box {
        padding: 0px;
    }
    ```

-   使用 16 进制表示颜色，颜色值采用小写，#rrggbb 的情况简写为#rgb，有透明度的情况使用 rgba 表示

    ```
    // 正确
    .box {
        background: rgba(0, 0, 255, .5);
        color: #3ec;
    }
    // 错误
    .box {
        background: white;
        opacity: 0.5;
        color: #33eecc;
    }
    ```

-   同一组属性尽量按照功能顺序书写，以 Formatting Model（布局方式、位置） > Box Model（尺寸） > Typographic（文本相关） > Visual（视觉效果） 的顺序书写，以提高代码的可读性

    -   Formatting Model 相关属性包括：display / position / top / right / bottom / left / float / overflow 等
    -   Box Model 相关属性包括：margin / border / padding / width / height 等
    -   Typographic 相关属性包括：font / line-height / text-align / word-wrap 等
    -   Visual 相关属性包括：background / color / transition / list-style 等

    ```
    // 推荐
    .sidebar {
        // formatting model
        position: absolute;
        top: 50px;
        left: 0;
        overflow-x: hidden;
        // box model
        width: 200px;
        padding: 5px;
        border: 1px solid #ddd;
        // typographic
        font-size: 14px;
        line-height: 20px;
        // visual
        background: #f5f5f5;
        color: #333;
        transition: color 1s;
    }
    ```

-   font-family 属性

    -   font-family 属性中的字体族名称应使用字体的英文 Family Name，其中如有空格，须放置在引号中。

        ```
        // 示例
        h1 {
            font-family: "Microsoft YaHei";
        }
        ```

    -   font-family 不区分大小写，但在同一个项目中，同样的 Family Name 大小写必须统一。

        ```
        // 正确
        body {
            font-family: Arial, sans-serif;
        }

        h1 {
            font-family: Arial, "Microsoft YaHei", sans-serif;
        }

        // 错误
        body {
            font-family: arial, sans-serif;
        }

        h1 {
            font-family: Arial, "Microsoft YaHei", sans-serif;
        }
        ```

    -   font-family 按「西文字体在前、中文字体在后」、「效果佳 (质量高/更能满足需求) 的字体在前、效果一般的字体在后」的顺序编写，最后必须指定一个通用字体族( serif / sans-serif )

        ```
        // 示例
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, PingFangSC-Regular, "Microsoft Yahei", Verdana, sans-serif;
        }
        ```

    -   不推荐在业务中重写 font-family

-   url()中的路径不添加引号

    ```
    // 推荐
    .box {
        background-image: url(../imgs/banner.jpg);
    }
    // 不推荐
    .box {
        background-image: url('../imgs/banner.jpg');
    }
    ```

-   推荐并适当缩写值
    “适当”是因为缩写总是会包含一系列的值，而有时候我们并不希望设置某一值，反而造成了麻烦，那么这时候你可以不缩写，而是分开写。

    ```
    // 有时我们只想设置一个容器水平居中，那么设置left，right就好，而top和bottom不是这个样式要关心的（如果设置了反倒会影响其他样式在这个容器上的使用）

    // 示例
    <div class="box center"></div>

    .box {
        margin-top: 10px;
    }
    // 这种简写将会覆盖.box里的设置
    .center {
        margin: 0 auto;
    }

    // 比如下面这个模块的样式设置，我们确实需要设置padding的所有项，于是我们就可以采用缩写
    .footer {
        padding: 12px 3px;
    }
    ```

-   对于属性值或颜色参数，省略小于 1 的小数前面的 0 （例如，.5 代替 0.5；-.5px 代替 -0.5px）

-   无边框设置

    ```
    // 正确
    .box {
        border: none;
    }
    // 错误
    .box {
        border: 0; // 浏览器会进行多余的渲染，性能不佳
    }
    ```

-   层级(z-index)禁止随意设置，页面弹窗、气泡为最高级（最高级为 999）；普通区块为 10-90 内 10 的倍数；同层的多个元素，在该层级内使用相同的 z-index 或递增。

-   禁止使用 !important (特殊情况除外，如覆盖第三方插件中的样式等)

-   禁止使用 filter

-   多个 class 里有一个或多个公共属性，应该将属性抽取到一个单独的 class 中或者使用泛选择器([attribute~=value], [attribute^=value],[attribute$=value],[attribute*=value])，泛选择器应确保不会有全局污染，避免多次书写重复代码

    ```
    // 正确
    <div>
        <span class="icon-book"></span>
        <span class="icon-pen"></span>
    </div>

    [class^="icon-"] {
        background-image: url(../imgs/sprite.png) no-repeat;
    }

    .icon-book {
        background-positon: 0 -16px;
    }

    .icon-pen {
        background-positon: -16px -16px;
    }
    // 错误
    <div>
        <span class="icon-book"></span>
        <span class="icon-pen"></span>
    </div>

    .icon-book {
        background-image: url(../imgs/sprite.png) no-repeat;
        background-positon: 0 -16px;
    }

    .icon-pen {
        background-image: url(../imgs/sprite.png) no-repeat;
        background-positon: -16px -16px;
    }
    ```

#### Hack 规范

通常我们禁止在 CSS 的一个选择器中使用 hack 混编，如果你确实需要写 hack, 我们应该有一个 class： xxx-fix, 最好把所有的 hack 放在一个独立的文件, 通过 JS 特性检测或者直接添加到 dom 中。

```
// 错误
.selector {
    key: value;
    key: fix-value\0; //ie 9-11
}
// 正确
.selector {
    key: value;
}

.selecor-ie-fix {
    key: fix-value\0; //ie 9-11
}
```

#### 命名规范

-   文件夹命名

    -   css 文件夹命名应参照项目文件夹命名规则，命名总是以字母开头而不是数字，且字母一律小写，以中划线连接多个单词且不带其他标点符号。
        如：input-number
        有复数结构时，采取复数命名法。
        如： style styles
        |- components
        |- input-number
        |- inputNumber.html
        |- inputNumber.js
        |- styles
        |- input_number.scss
        |- images
        |- menu

-   文件命名

    -   全站架构：(以下文件放在跟路径下的 styles 目录中)

    ```
    基本共用 base.scss
    布局、版面 layout.scss
    主题 themes.scss
    专栏 columns.scss
    文字 font.scss
    主要的 main.scss
    表单 forms.scss
    补丁 mend.scss
    打印 print.scss
    变量 variables.scss
    功能函数 mixins.scss
    色值 colors.scss
    动画 animations.scss
    字体 iconfont.scss
    ```

    -   组件级 / 应用级：（放在组件/应用目录中）

    ```
    css模块文件，其文件名必须与模块名一致。
    css页面文件，其文件名必须与HTML文件名一致。
    目的是让开发人员快速找到该页面或组件对应的css文件。
    文件命名总是以字母开头而不是数字，且字母一律小写，以下划线连接且不带其他标点符号。
    radio.scss
    main-list.scss
    main-detail.scss
    ```

-   变量命名

    -   命名变量的最佳方式就是使用抽象名词，尽量取消名字和值之间的直接关系。
    -   使用'\$'开头+ 语义化的变量名。
    -   避免使用无意义的词，如: ![calendar-component ->](https://math.jianshu.com/math?formula=calendar-component%20-%3E)calendar
    -   推荐变量的意义在前面，功能在后面

    ```
    // 不推荐
    $red: #F50707;
    $yellow: #B3F724;

    // 推荐
    $brand-color: #F50707;
    $accent-color: #B3F724;

    // 你可能会使用名称加-color的后缀来命名颜色的变量:
    // Base colors
    $base-color: #333;
    $brand-color: #F50707;
    $brand-80-color: rgba($color-brand, 0.8);
    $accent-color: #B3F724;

    // 或者使用header-或者footer-来命名一些特殊的区域：
    // Header
    $header-height: 100px;
    $header-background-color: $color-brand;
    // Footer
    $footer-height: 200px;
    $footer-background-color: #aaa;

    // 不推荐
    $z-index-modal
    $padding-body
    // 推荐
    $modal-z-index
    $body-padding
    ```

-   选择器命名

    ```
      推荐采用BEM方式命名
      // BE模式 block__element：块里的元素，如：nav（block）里的 a 标签(element)
      <nav class="g-nav">
          <a href="#" class="g-nav__item">工作动态</a>
      </nav>
      .g-nav__item {

      }

      // BM模式 block--modifier: 块元素加修饰符
      // g-nav表示导航的通用样式，g-nav-top表示该导航特有的样式，g-nav--active表示激活的nav
      <nav class="g-nav g-nav-top g-nav--active">
      </nav>
      .g-nav--active {

      }

      // BEM模式 block__element--modifier nav块里的a元素加上active状态
      <nav class="g-nav">
          <a href="#" class="g-nav__item g-nav__item--active">当前状态</a>
      </nav>
      .g-nav__item--active {

      }

      BEM只允许出现B__E--M,不允许出现B__B__B__E--M   B__E__E__E--M   B__E--M--M--M
      如果层级过多，可以使用以下方式：
      B__E--M > B__E--M > B__E--M(最多3层B__E--M嵌套)

      // 推荐
      <div class="c-card"><!-- B -->
          <div class="c-card__header"><!-- B__E -->
              <h2 class="c-card-title"><!-- B__E > B -->
                  <i class="c-card-title__icon--small"></i><!-- B__E > B__E--M -->
                  <i class="c-card-title__icon--big"></i><!-- B__E > B__E--M -->
                  <span class="c-card-title__text-wrap">Title text here</span><!-- B__E > B__E -->
              </h2>
          </div>
      </div>
      // 推荐
      .c-card {                      // B

          &__header {                // B__E

              > .c-card-title {      // B__E > B

                  &__icon--small {   // B__E > B__E--M

                  }

                  &__icon--big {     // B__E > B__E--M

                  }

                  &__text-wrap {     // B__E > B__E

                  }
              }
          }

      }

      // 不推荐
      <div class="c-card">
          <div class="c-card__header">
              <h2 class="c-card__header__title">
                  <i class="c-card__header__title__icon"></i>
                  <span class="c-card__header__title__text">Title text here</span>
              </h2>
          </div>
      </div>

      // 不推荐
      .c-card {

          &__header{

              &__title {

                  &__icon {

                  }

                  &__text {

                  }
              }
          }
      }

      - 注意到以上示例中使用了c- 前缀。这个c代表'component'，给组件加上命名空间，它提高了代码的可读性。
      类型 | 前缀 | 例子 | 描述
      布局 | (g-) | g-header | (global)例如头部，尾部，主体，侧栏等
      组件 | (c-) | c-card | (component)较大整体，如登录注册，搜索等
      元件 | (u-) | u-btn | 不可再分个体，例如按钮，input框等
      功能 | (f-) | f-clear | (function)使用频率较高样式，例如清除浮动
      皮肤 | (s-) | s-nav | (skin) 只包含皮肤的样式
      主线 | (ig-) | ig-header | (igoal)主线模块中组件Block的前缀
      审批 | (ap-) | ap-header | (approve)审批模块中组件Block的前缀
      ...
    ```

```
命名时需要注意的点：
- 规则命名中，一律采用小写加中划线的方式，不允许使用大写字母或_
- 命名避免使用中文拼音，应该采用更简明有语义的英文单词进行组合
- 命名注意缩写，但是不能盲目缩写
- 不允许通过1、2、3等序号进行命名
- 避免class与id重名
- class用于标识某一个类型的对象，命名必须言简意赅
- 尽可能提高代码模块的复用，样式尽量用组合的方式
- 公共样式名不得包含业务名称
```

-   mixins 命名

    -   见名知义
    -   小写加中划线，不允许出现大小字母或\_

    ```
    // 不推荐
    @mixin button($background: green) {

    }
    // 不推荐
    @mixin buttonBg($background: green) {

    }
    // 不推荐
    @mixin button_bg($background: green) {

    }
    // 推荐
    @mixin button-bg($background: green) {

    }
    ```

    多个参数之间用逗号分隔，给参数设置默认值

#### 重写规范

我们不允许直接使用公共库的选择器进行重写，如果要进行重写，必须自己重新加一个新的选择器，并且，这个选择器不能对公共库有影响。

```
// 错误
.qf-xxx .qf-btn {
    //some rewriting code
}
// 正确
.qf-xxx__qf-btn {
    //some rewriting code
}
//使用的时候用qf-btn 和 qf-xxx__qf-btn两个class, 所以在写组件的时候，为了考虑组件的通用性和可重写性，建议组件开发人员，都提供一个外部的样式输入接口
```

### H5 规范

-   标签使用遵循 H5 标准
-   标签名称、属性统一使用小写
-   标签属性值统一使用双引号
-   标签属性顺序遵循 class - id - name - 自定义属性 - vue 绑定属性 - 事件
-   非闭合标签无须闭合：<br> <hr> <input> 等
-   不能出现非自定义组件外的无效标签
-   结构尽可能简单，尽量比较深嵌套结构
-   Vue 尽量避免 dom 操作
-   Vue 页面基本结构

```
<template>
    <u-page>
        <u-header slot="header" leftText='标题' @back="onBack"></u-header>
        页面内容
        <u-footer slot="footer">可选</u-footer>
    </u-page>
</template>
<script>
import UPage from '@/components/UPage/index';
import UHeader from '@/components/UHeader/index';
import UFooter from '@/components/UFooter/index';
export default {
    name:'name',//与router中页面name值一致
    components: {UPage,UHeader,UFooter},
    props:{
        attr:{
            type:String,
            default:''
        }
    },
    data() {
        return {};
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    destoryed() {},
    methods: {},
};
</script>
<style lang="scss" scoped>
    @import "./style.scss";
</style>

```

### JS 规范

#### 类型规范

> 对于常量或不修改的变量声明使用 const，对于只在当前作用域下有效的变量，应使用 let，全局变量使用 var。将所有 const 变量放在一起，然后将所有 let 变量放在一起

```
const foo = 1;

let foo1 = 2;
let bar = foo;
bar = 9;
foo1 = 3;

console.log(foo, bar); // => 1, 9
console.log(foo, bar, str); // => 1, 9,'ouven'
```

> const 和 let 使用时注意，let 和 const 都是块作用域的

```
// const and let only exist in the blocks they are defined in.
{
  let a = 1;
  const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

#### 符串

> 使用单引号 '

```
// bad
var name = "Bob Parr";

// good
var name = 'Bob Parr';

// bad
var fullName = "Bob " + this.lastName;

// good
var fullName = 'Bob ' + this.lastName;
```

超过 80 个字符的字符串应该使用字符串连接换行 注：如果过度使用长字符串连接可能会对性能有影响。jsPerf & Discussion

```
// bad
var errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

// bad
var errorMessage = 'This is a super long error that \
was thrown because of Batman. \
When you stop to think about \
how Batman had anything to do \
with this, you would get nowhere \
fast.';


// good
var errorMessage = 'This is a super long error that ' +
  'was thrown because of Batman.' +
  'When you stop to think about ' +
  'how Batman had anything to do ' +
  'with this, you would get nowhere ' +
  'fast.';

```

> 编程构建字符串时，使用字符串模板而不是字符串连接

模板给你一个可读的字符串，简洁的语法与适当的换行和字符串插值特性。

```
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

#### 数组类型

> 使用字面量语法创建数组

```
// bad
const items = new Array();

// good
const items = [];
```

> 如果你不知道数组的长度，使用 push

```
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

> 使用 ... 来拷贝数组，不要使用 Array.from、Array.of 等数组的新的内置 API，Array 新 api 用于适合的场景

```
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];

// not good
const foo = [1,2,3];
const nodes = Array.from(foo);
```

#### 解构 Destructuring

使用对象的多个属性时请建议使用对象的解构赋值，解构赋值避免了为这些属性创建临时变量或对象。即使转化成 es5 都是一样的

> 嵌套结构的对象层数不能超过 3 层

```
// not good
let obj = {
  'one': [
    {
      'newTwo': [
        {
          'three': [
            'four': '太多层了，头晕晕'
          ]
        }
      ]
    }
  ]
};

// good
let obj = {
  'one': [
    'two',
    {
      'twoObj': '结构清晰'
    }
  ]
};
```

> 解构语句中统一不使用圆括号

```
// not good
[(a)] = [11]; // a未定义
let { a: (b) } = {}; // 解析出错


// good
let [a, b] = [11, 22];
```

> 对象解构

对象解构元素与顺序无关 对象指定默认值时仅对恒等于 undefined ( !== null ) 的情况生效

> 若函数形参为对象时，使用对象解构赋值

```
// not good
function someFun(opt) {
  let opt1 = opt.opt1;
  let opt2 = opt.opt2;
  console.log(op1);
}


// good
function someFun(opt) {
  let { opt1, opt2 } = opt;
  console.log(`$(opt1) 加上 $(opt2)`);
}

function someFun({ opt1, opt2 }) {
  console.log(opt1);
}
```

> 若函数有多个返回值时，使用对象解构，不使用数组解构，避免添加顺序的问题

```
// not good
function anotherFun() {
  const one = 1, two = 2, three = 3;
  return [one, two, three];
}
const [one, three, two] = anotherFun(); // 顺序乱了
// one = 1, two = 3, three = 2


// good
function anotherFun() {
  const one = 1, two = 2, three = 3;
  return { one, two, three };
}
const { one, three, two } = anotherFun(); // 不用管顺序
// one = 1, two = 2, three = 3
```

> 已声明的变量不能用于解构赋值（语法错误）

```
// 语法错误
let a;
{ a } = { b: 123};
```

> 数组解构时数组元素与顺序相关

例如交换数组两个元素的值

```
let x = 1;
let y = 2;

// not good
let temp;
temp = x;
x = y;
y = temp;


// good
[x, y] = [y, x]; // 交换变量
```

> 将数组成员赋值给变量时，使用数组解构

```
const arr = [1, 2, 3, 4, 5];

// not good
const one = arr[0];
const two = arr[1];


// good
const [one, two] = arr;
```

> 函数有多个返回值时使用对象解构，而不是数组解构。

这样你就可以随时添加新的返回值或任意改变返回值的顺序，而不会导致调用失败。

```
function processInput(input) {
    // then a miracle occurs
    return [left, right, top, bottom];
  }

  // the caller needs to think about the order of return data
  const [left, __, top] = processInput(input);

  // good
  function processInput(input) {
    // then a miracle occurs
    return { left, right, top, bottom };
  }

  // the caller selects only the data they need
  const { left, right } = processInput(input);
```

#### 函数

> 使用函数声明而不是函数表达式

函数声明拥有函数名，在调用栈中更加容易识别。并且，函数声明会整体提升，而函数表达式只会提升变量本身。这条规则也可以这样描述，始终使用箭头函数来代替函数表达式。

```
// bad
const foo = function () {
};

// good
function foo() {
}
```

绝对不要在一个非函数块（if，while，等等）里声明一个函数，把那个函数赋给一个变量。浏览器允许你这么做，但是它们解析不同 注：ECMA-262 把 块 定义为一组语句，函数声明不是一个语句。阅读 ECMA-262 对这个问题的说明

```
// bad
if (currentUser) {
  function test() {
    console.log('Nope.');
  }
}

// good
if (currentUser) {
  var test = function test() {
    console.log('Yup.');
  };
}
```

> 绝对不要把参数命名为 arguments, 这将会覆盖函数作用域内传过来的 arguments 对象

```
// bad
function nope(name, options, arguments) {
  // ...stuff...
}

// good
function yup(name, options, args) {
  // ...stuff...
}
```

> 永远不要使用 arguments，使用 ... 操作符来代替

... 操作符可以明确指定你需要哪些参数，并且得到的是一个真实的数组，而不是 arguments 这样的类数组对象。

```
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}
```

> 使用函数参数默认值语法，而不是修改函数的实参

```
// really bad
function handleThings(opts) {
  opts = opts || {};
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
}

// good
function handleThings(opts = {}) {
  // ...
}
```

#### 箭头函数 Arrow Functions

> 当必须使用函数表达式时（例如传递一个匿名函数时），请使用箭头函数

箭头函数提供了更简洁的语法，并且箭头函数中 this 对象的指向是不变的，this 对象绑定定义时所在的对象，这通常是我们想要的。如果该函数的逻辑非常复杂，请将该函数提取为一个函数声明。

```
// bad
"use strict";
var fn = function fn(v) {
  return console.log(v);
};

// good
var fn= (v=>console.log(v));
```

> 箭头函数总是用括号包裹参数，省略括号只适用于单个参数，并且还降低了程序的可读性

```
// bad
[1, 2, 3].forEach(x => x * x);

// good
[1, 2, 3].forEach((x) => x * x);
```

> 立即执行的匿名函数

```
// 函数表达式
// immediately-invoked function expression (IIFE)
// good，看起来就很厉害
(() => {
  console.log('Welcome to the Internet. Please follow me.');
})();
```

#### 对象

> 使用对象字面量创建对象

```
// bad
var item = new Object();

// good
var item = {};
```

> 不要使用保留字（reserved words）作为键，否则在 IE8 下将出错

```
// bad
var superman = {
  class: 'superhero',
  default: { clark: 'kent' },
  private: true
};

// good
var superman = {
  klass: 'superhero',
  defaults: { clark: 'kent' },
  hidden: true
};
```

> 创建对象时使用计算的属性名，而不要在创建对象后使用对象的动态特性，这样可以在同一个位置定义对象的所有属性。

```
function getKey(k) {
    return `a key named ${k}`;
  }

  // bad
  const obj = {
    id: 5,
    name: 'San Francisco'
  };
  obj[getKey('enabled')] = true;

  // good
  const obj = {
    id: 5,
    name: 'San Francisco',
    [getKey('enabled')]: true
  };
```

> 使用定义对象方法的简短形式

```
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  }
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  }
};
```

> 使用定义对象属性的简短形式，书写起来更加简单，并且可以自描述。这里和 es5 有些不同，需要注意下

```
const lukeSkywalker = 'Luke Skywalker';

  // bad
  const obj = {
    lukeSkywalker: lukeSkywalker
  };

  // good
  const obj = {
    lukeSkywalker
  };
```

> 将所有简写的属性写在对象定义的最顶部，这样可以更加方便地知道哪些属性使用了简短形式。

```
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  episodeOne: 1,
  twoJedisWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker
};

// good
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJedisWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4
};
```

#### 类

> 总是使用 class 关键字，避免直接修改 prototype，class 语法更简洁，也更易理解。

```
// bad
function Queue(contents = []) {
  this._queue = [...contents];
}
Queue.prototype.pop = function() {
  const value = this._queue[0];
  this._queue.splice(0, 1);
  return value;
}

// good
class Queue {
  constructor(contents = []) {
    this._queue = [...contents];
  }
  pop() {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }
}
```

> 类名与花括号须保留一个空格间距，类中的方法定义时，括号 ) 也须与花括号 { 保留一个空格间距

```
// not good
class Foo{
  constructor(){
    // constructor
  }
  sayHi()    {
    // 仅保留一个空格间距
  }
}

// good
class Foo {
  constructor() {
    // constructor
  }
  sayHi() {
    // 仅保留一个空格间距
  }
}
```

> 定义类时，方法的顺序如下：

-   constructor
-   public get/set 公用访问器，set 只能传一个参数
-   public methods 公用方法，公用相关命名使用小驼峰式写法(lowerCamelCase)
-   private get/set 私有访问器，私有相关命名应加上下划线 \_ 为前缀
-   private methods 私有方法

```
// good
class SomeClass {
  constructor() {
    // constructor
  }

  get aval() {
    // public getter
  }

  set aval(val) {
    // public setter
  }

  doSth() {
    // 公用方法
  }

  get _aval() {
    // private getter
  }

  set _aval() {
    // private setter
  }

  _doSth() {
    // 私有方法
  }
}
```

> 如果不是 class 类，不使用 new

```
// not good
function Foo() {

}
const foo = new Foo();

// good
class Foo {

}
const foo = new Foo();
```

> 使用 extends 关键字来继承

这是一个内置的继承方式，并且不会破坏 instanceof 原型检查。

```
// bad
  const inherits = require('inherits');
  function PeekableQueue(contents) {
    Queue.apply(this, contents);
  }
  inherits(PeekableQueue, Queue);
  PeekableQueue.prototype.peek = function() {
    return this._queue[0];
  }

  // good
  class PeekableQueue extends Queue {
    peek() {
      return this._queue[0];
    }
  }
```

#### 模块

总是在非标准的模块系统中使用标准的 import 和 export 语法，我们总是可以将标准的模块语法转换成支持特定模块加载器的语法。

> 推荐使用 import 和 export 来做模块加载

```
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

> import / export 后面采用花括号{ }引入模块的写法时，建议在花括号内左右各保留一个空格

```
// not good
import {lightRed} from './colors';
import { lightRed} from './colors';

// good
import { lightRed } from './colors';
```

> 不要使用通配符 \* 的 import，这样确保了一个模块只有一个默认的 export 项

```
// bad
import * as AirbnbStyleGuide from './AirbnbStyleGuide';

// good
import AirbnbStyleGuide from './AirbnbStyleGuide';
```

> 不要直接从一个 import 上 export

虽然一行代码看起来更简洁，但是有一个明确的 import 和一个明确的 export 使得代码行为更加明确。

```
// bad
// filename es6.js
export default { es6 } from './airbnbStyleGuide';

// good
// filename es6.js
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

> 多变量要导出时应采用对象解构形式

```
// not good
export const a= 'a';
export const b= 'b';

// good
export const a= 'a';
export const b= 'b';

export default { a, b };
```

> 导出单一一个类时，确保你的文件名就是你的类名

```
// file contents
class CheckBox {
  // ...
}
module.exports = CheckBox;

// in some other file
// bad
const CheckBox = require('./checkBox');

// bad
const CheckBox = require('./check_box');

// good
const CheckBox = require('./CheckBox');
```

> 导出一个默认小驼峰命名的函数时，文件名应该就是导出的方法名

```
function makeStyleGuide() {
}

export default makeStyleGuide;
```

> 导出单例、函数库或裸对象时，使用大驼峰命名规则

```
const AirbnbStyleGuide = {
  es6: {
  }
};

export default AirbnbStyleGuide;
```

#### Iterators 和 Generators

> Iterators。性能比较差，对于数组来说大致与 Array.prototype.forEach 相当，比不过原生的 for 循环，而且用起来比较麻烦，数组提供了 for...of，对象提供了 for...in，不推荐使用迭代器。

```
const numbers = [1, 2, 3, 4, 5];

// bad
var iterator = numbers[Symbol.iterator]();
var result = iterator.next();
let sum = 0;
while (!result.done) {
  sum += result.value;
  result = iterator.next();
}

// good
let sum = 0;
for (let num of numbers) {
  sum += num;
}
sum === 15;

// good
let sum = 0;
numbers.forEach((num) => sum += num);
sum === 15;

// best (use the functional force)
const sum = numbers.reduce((total, num) => total + num, 0);
sum === 15;
```

> generators。不推荐使用，或者非常谨慎地使用。

生成器不是用来写异步的，虽然确实有这样一个效果，但这仅仅是一种 Hack。异步在未来一定是属于 async 和 await 这两个关键字的，但太多人眼里生成器就是写异步用的，这会导致滥用。暂时推荐用 promise 来实现异步。

#### 属性访问

> 使用点 . 操作符来访问常量属性

```
const luke = {
  jedi: true,
  age: 28
};

// bad
const isJedi = luke['jedi'];

// good
const isJedi = luke.jedi;
```

> 使用中括号[] 操作符来访问变量属性

```
var luke = {
  jedi: true,
  age: 28
};

function getProp(prop) {
  return luke[prop];
}

var isJedi = getProp('jedi');
```

#### map + set + weakmap + weakset 数据结构

> 新加的集合类型，提供了更加方便的获取属性值的方法，可以检查某个属性是属于原型链上还是当前对象的，并用获取对象的 set 和 get 方法

> 但是，推荐使用 weakmap 和 weakset，而不是 map 和 set，除非必须使用。普通集合会阻止垃圾回收器对这些作为属性键存在的对象的回收，有造成内存泄漏的危险

```
// not good, Maps
var wm = new Map();
wm.set(key, { extra: 42 });
wm.size === 1

// not good, Sets
var ws = new Set();
ws.add({ data: 42 });

// good, Weak Maps
var wm = new WeakMap();
wm.set(key, { extra: 42 });
wm.size === undefined

// good, Weak Sets
var ws = new WeakSet();
ws.add({ data: 42 });//因为添加到ws的这个临时对象没有其他变量引用它，所以ws不会保存它的值，也就是说这次添加其实没有意思

// not good
let object = {},
object.hasOwnProperty(key)

// good
let object = new WeakSet();
object.has(key) === true;
```

-   当你的元素或者键值有可能不是字符串时，推荐使用 WeakMap 和 WeakSet。

```
// bad
var obj = { 3:'value' };

// good
var ws = new WeakSet();
ws.add(3, 'value');
```

-   有移除操作的需求时，使用 WeakMap 和 WeakSet。

```
// bad
var obj = { 'key':'value' };
delete obj.key;

// good
var ws = new WeakSet();
ws.add('key', 'value');
ws.remove('key');
```

-   当仅需要一个不可重复的集合时，使用 WeakSet 优先于普通对象，而不要使用{foo: true}这样的对象。

```
// bad
var obj = { 'key':'value' };

// good
var ws = new WeakSet();
ws.add('key', 'value');
```

-   当需要遍历功能时，使用 WeakMap 和 WeakSet，因为其可以简单地使用 for..of 进行遍历，性能更高

```
// bad
var obj = { key:'value', key1: 'value1' };
for(var key in obj){
}

// good
var ws = new WeakSet();
ws.add('key', 'value').add('key1', 'value1');
for(var key of ws){
}
```

#### promise、symbols、proxies

> promise 是一种异步处理模式。发 promise 申明和调用分开，推荐异步方式使用 Promise。

```
// not good
(new Promise(resolve, reject){})
  .then(cunction(){},function(){})
  .then();

// good
var promise = new Primise(function(resolve, reject){});
promise
  .then(function(){},function(){]})
  .then();
```

> symbol 用于对象的键和私有属性，使用过于复杂，没有使用必要，容易扰乱外层作用域。总之不要使用

```
// good
function MyClass(privateData) {
  let key = privateData;
}

//not good
const key = Symbol('key');
function MyClass(privateData) {
  this[key] = privateData;
}

const object = new MyClass("hello")
object['key'] === undefined //无法访问该属性，因为是私有的
```

> Proxy 可以监听对象身上发生了什么事情，并在这些事情发生后执行一些相应的操作，没有特别要注意的，尽情用吧。

#### 不要使用统一码

> 字符串支持新的 Unicode 文本形式，也增加了新的正则表达式修饰符 u 来处理码位，但是一般不要这样处理，会减低程序可读性且处理统一码速度会降低

```
// not good
'字符串'.length == 6

// 新加的：正则支持统一码'u'， 但仍建议不使用
// not good
'字符串'.match(/./u)[0].length == 6
'字符串'.codePointAt(0) == 0x20BB7
```

#### 进制数支持

> 加入对二进制(b)和八进制(o)字面量的支持。该特性可以使用

```
// ok
0b111110111 === 503 // true
0o767 === 503 // true
```

#### 不建议使用 reflect 对象和 tail calls 尾调用

> 没有使用的必要性

## 设计规范

### 组件设计规范

-   组件必须提供 name
-   基础组件命名统一以“U”开头，遵循大驼峰命名规范
-   扩展组件命名统一以“E”开头，遵循大驼峰命名规范
-   基础组件不能随便增加，并且基础组件要保持原子性，不能相互依赖
-   扩展组件则是基础组件、扩展组件的组合结构
-   文档中组件说明部分注释必须遵循“@param {Type} 参数名 说明”、“@property 事件名 说明”、”@example 使用例子“
-   组件的增删改操作必须在组件目录中的本文档内修改相应说明
-   组件编写优先使用项目中 SCSS 全局样式变量、mixin，减少代码冗余
-   组件编写大致结构为 “index.vue” 和 “style.scss” 组合
-   组件编写一定明确功能单一，避免“功能全面”
-   组件编写变量统一遵循驼峰命名，HTML 模板中使用遵循 kebab-case（如：定义 MyTest 组件，则 my-test）
-   组件编写 template 中避免使用 ES6 模板语法、 复杂表达式、过滤器、方法调用，以便后期迁入小程序直接使用
-   组件编写必须在 demo 中提供使用例子
-   组件中不要依赖项目中其他 JS 库、工具 JS 等，以便后期独立维护
-   组件定义 props 时应该注意尽量避免和 H5 原生属性（如 class、style）重名
-   使用自定义组件时，应该使用组件暴露的 props 实现 UI 效果，不应该直接使用 class 或者 style ，除非使用第三方 UI 如 element-ui 的无法使用提供的 props 进行定制时考虑使用
-   自定义组件，自定义事件统一使用“on-”作为前缀，用于区分和 HTML 原生事件，如自定义点击事件为“on-click”
-   注释规范参见[JSDOC](https://jsdoc.app/)

### API 设计规范

-   变量遵循驼峰命名
-   涉及全局变量请以项目 engine 为前缀
-   尽量按照原生提供的事件名为 API 方法名称
-   文档必须注释：方法说明、输入参数、返回参数、调用例子

-预定文件说明

```
.
├── alipay.js        // 封装 AlipayJSBridge.call
├── components.js    // 组件统一导出
├── filter.js        // 全局过滤器
├── mixin.js         // Vue 生命周期 mixin
├── native.js        // 自定义原生 API 封装
├── nebula.js        // mPaaS 原生 API 封装
├── protos.js        // 部分浏览器内置对象原型扩展，如 Date 扩展日期计算
└── store.js         // session 数据状态管理，可选
```

### 工程设计规范

-   一般结构

```
.
├── README.md                        // 项目说明
├── build                            // 项目编译相关
├── config                           // 项目环境配置
├── dist                             // 项目编译输出
│   ├── amr                          // 预置离线包
│   │   ├── 20200000_1.0.0.0.amr     // 预置离线包1
│   │   └── 20200001_1.0.0.0.amr     // 预置离线包2
│   ├── h5app.json                   // 离线包信息
│   ├── map                          // css、js map文件
│   │   └── demo                     // demo 离线包 map
│   ├── options.json                 // 编译信息
│   ├── www                          // 编译后文件
│   │   ├── demo                     // 普通离线包
│   │   └── mpaas-test.aliyuncs.com  // 公共离线包
│   └── zip                          // 部署离线包
│       ├── 20200000.zip             // 离线包1
│       ├── 20200001.zip             // 离线包2
│       ├── common.sh                // 自动部署脚本
│       └── demo.sh                  // 自动部署脚本
├── loaders                          // 自定义加载器
├── mock                             // 模拟数据
│   ├── api                          // 模拟接口
│   └── img                          // 模拟图片
├── mpaas                            // 框架离线包相关
├── package-lock.json                // 项目依赖安装信息
├── package.json                     // 项目配置
├── plugins                          // 自定义插件
├── reports                          // 性能分析
├── src                              // 源码目录
│   ├── assets                       // 资源
│   │   ├── img                      // 图片资源
│   │   ├── svg                      // SVG资源
│   │   └── video                    // 视频资源
│   ├── index.html                   // H5 模板
│   ├── main.js                      // 公共工具
│   ├── packages                     // 离线包目录
│   │   └── demo                     // 离线包
│   └── scss                         // 公共样式
│       ├── app.scss                 // APP 公共样式
│       ├── func.scss                // 自定义样式函数
│       ├── index.scss               // 公共样式导出
│       ├── mixins.scss              // mixins
│       └── vars.scss                // 样式公共变量
├── static                           // 静态资源
│   ├── fastclick.min.js             // fastclick
│   ├── libs.css                     // 公共组件库样式
│   ├── libs.js                      // 公共组件库
│   ├── reset.css                    // 重置样式
│   ├── theme-advanced.css           // 高级版主题样式
│   ├── theme-default.css            // 默认主题样式
│   ├── theme-personal.css           // 私行版主题样式
│   ├── vconsole.min.js              // 调试工具
│   ├── vue.js                       // Vue 开发版
│   ├── vue.min.js                   // Vue 上线版
│   ├── vuex.js                      // Vuex 开发版
│   └── vuex.min.js                  // Vuex 上线版
├── test                             // 测试
│   ├── e2e                          // e2e 测试
│   └── unit                         // 单元测试
└── yarn.lock
```

## 补充

### 日志规范

公共项目中不再允许出现 console 相关 API，统一使用以下封装的日志输出对象

-   console.debug 对应使用 this.\$logger.debug，参数使用一样
-   console.log 对应使用 this.\$logger.info，参数使用一样
-   console.warn 对应使用 this.\$logger.warn，参数使用一样
-   console.error 对应使用 this.\$logger.error，参数使用一样

注：如果是 JS 中使用，请先引用 src/js/logger.js 在使用

### 主题规范

主题样式目前规划三个，分别是：

-   theme-default : 默认大众版主题
-   theme-advanced : 专业（高级）版主题
-   theme-personal : 私行版主题

编写组件时必须按照以下原则编写：

1. 样式编写过程中必须遵循以下原则

```
.
└── scss
    ├── advanced              // 高级版主题组件样式变量
    ├── default               // 默认版主题组件样式变量
    ├── personal              // 私行版主题组件样式变量
    ├── common.scss           // 全局样式
    ├── func.scss             // 功能函数
    ├── index.scss            // 样式导出入口
    ├── mixins.scss           // mixins 样式
    ├── theme-advanced.scss   // 专业版主题
    ├── theme-default.scss    // 默认版主题
    ├── theme-personal.scss   // 私行版主题
    ├── theme.scss            // 主题样式
    └── vars.scss             // 字体、尺寸、间隔变量
```

2. 根据 UI 提供主题配色规范，涉及颜色的 SCSS 变量统一在各自主题样式文件开头处定义，基本规则为 ui-color-颜色十六进制码（英文小写）

3. 每个组件的针对每一种配色再定义组件配色变量，引用主题公用颜色变量

4. 组件配色变量原则上命名遵循“见名知意”，如：app-btn-text-color，app-btn-bg-color，app-btn-border-color 等

5. 组件配色变量必须加上说明注释

6. 图片资源使用规范

-   assets 目录 emoji、common 一个目录并且没有子目录，分别表示表情图片、普通图片
-   涉及表情图片路径为 “http://img.emoji/表情.gif”
-   涉及普通图片路径为 “http://img.common/图片名.png”

-   VUE 示例

```js
// $assets 为挂载在 Vue 原型链上
<img :src="$assets.common + ic_back.png">

const url = this.$assets.common + 'ic_back.png';
```

-   SCSS 示例

```scss
// 直接拼接，不推荐
.test {
    background-image: url('http://img.common/ic_back.png');
}
// mixins，推荐，方便后续修改

// 编译后为 .test {background-image: url('http://img.common/ic_back.png');}
.test {
    @include setImageUrl('ic_back.png');
}
// 编译后为
/*
.test {
    background-image: url('http://img.common/ic_back.png');
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
*/
.test {
    @include setBackgroundImage('ic_back.png');
}
```

-   主题样式变量规则

*   针对不同版本主题，拆分目录单独维护，同一个版本主题目录中，按照组件名命名文件单独维护组件的样式变量
*   针对一个组件的样式变量中必须严格按照如下格式

```scss
// 变量说明，要求明确简短
$some-var: #ffffff;
// 变量说明，要求明确简短
$some-var: #ffffff;
```

### GIT 规范

```bash

# 分支命名规范：

# master  为主分支，用于部署生产环境，由 develop 以及 hotfix 合并
# develop 为开发分支
# feature 为开发新功能时，以 develop 为基础创建 feature，命名规范为 feature/开头的为特性
# release 为预上线分支，发布提测阶段，当有一组 feature 开发完成，合并 release 到 master 和 develop
# hotfix  为修复分支，线上出现紧急问题，以 master 为基线创建分支，修复完后合并到 master 和 develop

# 创建需求开发分支
$ git checkout develop/201908
$ git checkout -b feature/20190801

# 完成开发后合并到主开发分支
$ git checkout develop/201908
$ git merge feature/20190801 --no-ff

# 版本完成开发进入测试阶段，合并到发布分支
# git checkout release/201908
# git merge develop/201908 --no-ff

# 测试完成整个版本投产后合并到master
$ git checkout master
$ git merge release/201908 --no-ff

# 打个tag
$ git tag -a v1.0.0.0 -m '1.0.0.0 版本投产'

# 紧急线上问题修复
$ git checkout master
$ git checkout -b hotfix/201908

# 紧急问题修复完成合并到主分支
$ git checkout master
$ git merge hotfix/201908 --no-ff

# 代码提交规范：

# commit-msg 公式：<type>(<scope>): <subject>

# example
$ git commit -m "feat(index): 测试提交"

# 注意冒号后要有空格

# type 必须为以下固定值
# feat：    新功能（feature）
# fix：     修补bug
# docs：    文档（documentation）
# style：   格式（不影响代码运行的变动）
# refactor：重构（即不是新增功能，也不是修改bug的代码变动）
# test：    增加测试
# chore：   构建过程或辅助工具的变动

# scope：
# 选填，即本次变更的影响范围，可选为（全局、模块名、公共方法/文件名）

# subkect：
# 对本次提交的具体描述信息
# 合版代码，固定格式 release/xxxx合并到release/xxxx 2019-01-02 09:09:10

# 代码提交尽量细化粒度，即每完成一个小功能点，进行一次 commit 并为该小功能添加明确说明注释，禁止一次提交大量代码

```

### ENGINE 发布版本规范

正式发布时，必须执行 "npm run release" 进行发布版本记录并提交代码仓库，不能使用 "npm run build"

### 公共图片资源使用规范

由于目前将图片资源拆分成普通公共图片离线资源包和表情图片离线资源包，为了 engine 公共项目无侵入式依赖，将普通图片和表情图片访问链接地址打包固化为“http://img.asset/”和“http://img.emoji/”，因此需要在引用的业务项目中打包时处理成本项目的具体地址，基于 mPaaS 公共离线包规则地址结构应该为

“${apps.host}/${apps.appId}\_\${apps.workspaceId}/common/”

和

“${apps.host}/${apps.appId}\_\${apps.workspaceId}/emoji/”

### 业务项目考虑主题化规范

如果业务项目考虑后续支持主题化变更，则建议要求按照以下几点规则进行样式编码开发

-   严格按照如下结构设计离线包、模块和页面结构

```
.
├── demo                             // 离线包
│   ├── test                         // 业务模块
│   │   └── main                     // 页面
│   │       ├── entry.js             // 主入口
│   │       ├── index.vue            // Vue样式独立放到 style.scss
│   │       ├── style.scss           // 样式
│   │       ├── theme-default.scss   // 主题 default 样式变量定义
│   │       └── theme.scss           // 主题样式定义
```

-   Vue 中设置 name 属性，规则为“离线包+模块+页面”，符合驼峰命名，根标签定义样式作为顶级样式父类选择器，其余样式均定义在该类选择器
-   Vue 中 style 标签不指定 scoped
-   Vue 中定义 UI 涉及颜色值、图片 URL 相关变量定义到主题样式变量文件
-   Vue 中定义 UI 涉及颜色、图片相关样式单独定义，全部抽离定义到主题样式文件

#### 例子

比如离线包 demo 下模块 test 下 main 页面，规范如下：

-   /demo/test/main/index.vue

```vue
<template>
    <!-- 定义根标签样式类选择器-->
    <div class="demo-test-main">
        <!-- 使用主题样式类选择器修饰 -->
        <p class="demo-title th-title">标题</p>
        <!-- 使用主题样式类选择器修饰 -->
        <span class="demo-text th-text">说明文字</span>
    </div>
</template>
<script>
export default {
    // 指定 name 属性
    name: 'DemoTestMain',
    components: {},
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    destoryed() {},
    methods: {}
};
</script>
<!-- 不要使用 scoped -->
<style lang="scss">
// 普通样式定义
@import './style.scss';
// 主题样式定义
@import './theme-default.scss';
</style>
```

-   /demo/test/main/style.scss

```scss
// 顶级父选择器
.demo-test-main {
    margin: 0;

    .demo-title {
        margin: 0;
    }

    .demo-text {
        margin: 0;
    }
}
```

-   /demo/test/main/theme-default.scss

```scss
// 主题样式相关变量
// 标题文字颜色
$demo-test-main-title-color: #2b2b2b;
// 说明文字颜色
$demo-test-main-explain-color: #888888;

.app-theme-default {
    .demo-test-main {
        @import './theme.scss';
    }
}
```

-   /demo/test/main/theme.scss

```scss
// 主题样式
.th-title {
    color: $demo-test-main-title-color;
}

.th-text {
    color: $demo-test-main-explain-color;
}
```
