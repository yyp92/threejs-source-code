import SpriteText from "three-spritetext";

const spriteText = new SpriteText('aaa\n测试\n666', 300);

// 设置 padding，然后设置描边样式
spriteText.color = 'blue';
spriteText.padding = 80;
// spriteText.strokeWidth = 2;
// spriteText.strokeColor = 'blue';

// 设置 border 和背景颜色
spriteText.borderColor = '#ffffff';
spriteText.borderWidth = 10;
spriteText.borderRadius = 100;
spriteText.backgroundColor = 'lightpink';

// 支持换行

export default spriteText;
