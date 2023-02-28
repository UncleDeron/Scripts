// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: chalkboard;

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule;
const { DmYY, Runing } = require('./DmYY');

// @组件代码开始
class Widget extends DmYY {
    constructor(arg) {
        super(arg);
        this.name = '友空间打卡';
        this.en = 'diworkSign';
        this.logo =
            'https://cdn.yonyoucloud.com/20180402/cloud/dist/images/favicon.ico';
        this.Run(module.filename);
    }

    cookie = '';
    dataSource = [];

    headers = '';
    body = '';
    workDay = true;

    init = async () => {
        try {
            const settings = this.getSettings()

            if (settings[this.en + '_header'] && settings[this.en + '_body']) {
                this.headers = settings[this.en + '_header'];
                this.body = settings[this.en + '_body']
            } else {
                await this._loadCk();
            }

            await this.getSignRecord();
        } catch (e) {
            console.log(e);
        }
    };



    // 获取cookie
    getCookie = async () => {
        const url = 'https://ezone.yonyoucloud.com/signin/index/webLogin?clientV=2-7.2.0-1-1';
        const method = 'POST';
        const response = await this.$request.post(url, {
            headers: this.headers,
            body: this.body,
            method,
        })
        try {
            const { code, data } = response;
            if (code === 0) {
                this.cookie = data;
                return this.cookie;
            } else {
                throw 'cookie 失效，请重新获取';
            }
        } catch (e) {
            console.log('❌错误信息1：' + e);
            return false;
        }

    }

    getSignRecord = async () => {
        this.dataSource = []
        let cookie = await this.getCookie();
        let signTime = getDateString();
        this.workDay = await this.isWorkDay(signTime.split(' ')[0]);
        if (!this.workDay) {
            return []
        }
        const url = `https://ezone.yonyoucloud.com/signin/attentance/records?clientV=2-7.2.0-1-1&token=${this.cookie}&signTime=${encodeURIComponent(signTime)}&language=zhs`;
        const method = `GET`;
        const response = await this.$request.get(url, {
            method,
        });
        try {
            const { code, data } = response;
            if (code === 0 && data.attentanceList.length > 0) {
                let count = data.attentanceList.length
                let dataSource = count === 1 ? data.attentanceList : [data.attentanceList[count - 1], data.attentanceList[0]]; // 最多只显示最早和最晚的两条记录
                dataSource.forEach((item) => {
                    item.signTimeFormat = new Date(item.signTime).toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    this.dataSource.push(item);
                });
                return this.dataSource;
            } else {
                return []
            }
        } catch (e) {
            console.log('❌错误信息2：' + e);
            return false;
        }
    };

    setListCell = async (cell, data, index) => {
        const { signTimeFormat } = data;
        const prefixMap = {
            '-1': '',
            '0': '上班：',
            '1': '下班：'
        }
        let body = cell.addStack();

        if (this.widgetFamily !== 'small') {
            const imageView = body.addStack();
            imageView.size = new Size(43, 43);
            imageView.cornerRadius = 5;
            body.addSpacer(10);
        }

        const textView = body.addStack();

        const prefix = prefixMap[index]

        const descText = textView.addText(`${prefix}${signTimeFormat}`);
        descText.font = this.widgetFamily.startsWith('accessory') ? Font.regularSystemFont(12) : Font.boldSystemFont(14);
        descText.textColor = this.widgetColor;
        descText.lineLimit = 1;

        textView.addSpacer(3);

        return cell;
    };

    setWidget = async (body, size) => {
        const container = body.addStack();
        container.layoutVertically();
        const dataSource = this.dataSource;
        if (dataSource.length > 0) {
            for (let index = 0; index < dataSource.length; index++) {
                const data = dataSource[index];
                let listItem = container.addStack();
                await this.setListCell(listItem, data, index);
                container.addSpacer(8);
            }
        } else {
            let listItem = container.addStack();
            let word = this.workDay ? '今天还没有签到哦~' : '今天休息~'
            await this.setListCell(listItem, {
                signTimeFormat: word,
                signTime: Date.now()
            }, -1);
            container.addSpacer(8);
        }

        body.addSpacer();
        const date = new Date();
        date.setTime(Date.now()); //注意，这行是关键代码

        const timerView = body.addStack()
        const timerText = timerView.addText(date.toLocaleTimeString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }));
        timerText.font = Font.footnote();
        timerText.textColor = this.widgetColor;
        timerText.lineLimit = 1;
        timerText.rightAlignText()
        return body;
    };

    renderSmall = async (w) => {
        return await this.setWidget(w, 2);
    };

    renderLarge = async (w) => {
        return await this.setWidget(w, 6);
    };

    renderMedium = async (w) => {
        return await this.setWidget(w, 2);
    };

    renderAccessory = async (w) => {
        return await this.setWidget(w, 2);
    }

    /**
     * 渲染函数，函数名固定
     * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
     */
    async render() {
        await this.init();
        const widget = new ListWidget();
        await this.getWidgetBackgroundImage(widget);
        const header = widget.addStack();
        if (this.widgetFamily.startsWith('accessory')) {

        } else if (this.widgetFamily !== 'small') {
            await this.renderJDHeader(header);
        } else {
            await this.renderHeader(header, this.logo, this.name, this.widgetColor);
        }
        widget.addSpacer(16);
        if (this.widgetFamily.startsWith('accessory')) {

        } else if (this.widgetFamily === 'medium') {
            return await this.renderMedium(widget);
        } else if (this.widgetFamily === 'large') {
            return await this.renderLarge(widget);
        } else {
            return await this.renderSmall(widget);
        }

    }

    renderJDHeader = async (header) => {
        header.centerAlignContent();
        await this.renderHeader(header, this.logo, this.name, this.widgetColor);
        header.addSpacer();
        const headerMore = header.addStack();
        headerMore.url = '';
        headerMore.setPadding(1, 10, 1, 10);
        headerMore.cornerRadius = 10;
        headerMore.backgroundColor = new Color('#fff', 0.5);
        const textItem = headerMore.addText('个人中心');
        textItem.font = Font.boldSystemFont(12);
        textItem.textColor = this.widgetColor;
        textItem.lineLimit = 1;
        textItem.rightAlignText();
        return header;
    };

    isWorkDay = async (date) => {
        const url = `https://timor.tech/api/holiday/info/${date}`;
        const method = 'GET';
        const response = await this.$request.get(url, {
            method,
        })
        try {
            const { code, type } = response;
            if (code === 0) {
                return [0, 3].includes(type.type);
            } else {
                console.log('获取工作日信息失败')
                return false
            }
        } catch (e) {
            console.log('❌错误信息1：' + e);
            return false;
        }
    }

    Run = (filename) => {
        if (config.runsInApp) {
            this.registerAction('基础设置', this.setWidgetConfig);
            this.registerAction('代理缓存', this._loadCk);
        }
    };

    _loadCk = async () => {
        try {
            const har = await this.getCache('boxapp_diwork_har');
            const body = await this.getCache('boxapp_diwork_body');
            let {headers} = this.transforJSON(har)

            if (headers && body) {
                this.headers = headers;
                this.body = this.transforJSON(body);
                this.settings[this.en + '_header'] = this.headers;
                this.settings[this.en + '_body'] = this.body;
                this.saveSettings();
            } else {
                throw 'ck 获取失败';
            }
            return true;
        } catch (e) {
            console.log(e);
            this.cookie = '';
            return false;
        }
    };
}

function getDateString() {
    // 创建一个Date实例
    let date = new Date();

// 获取年月日时分秒
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // 月份从0开始
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

// 如果小于10，补零
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;


}

// @组件代码结束
// await Runing(Widget, "", false); // 正式环境
await Runing(Widget, '', false); //远程开发环境
