'use strict';
const fs = require('fs-extra');
const path = require('path');
const Publisher = require('./Publisher.js')
const EpubGenerator = require('epub-gen')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt();
md.set({
    html: true, 
    breaks: true, 
});

module.exports = class Epub extends Publisher {

    constructor (contents) {
        super(contents);
        this.type = 'epub';
        this.distExt = '.epub';
    }

    convert (str){
        return md.render(
            str
            .replace(/｜([^《]+?)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
            .replace(/([一-龠々ヶ]+)《(.+?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
        );
    }

    output(contents) {
        fs.ensureDir( path.join( this.distDir, this.type ) )
        .then( () => {
            new EpubGenerator({
                content: contents,
                title: 'Redmineで始める異世界人心掌握術',
                author: '足羽川永都',
                publisher: '8novels',
                cover: path.resolve('./cover.jpeg'),
                output: path.join( this.distDir, this.type, `redmine-fantasy${this.distExt}` ),
                lang: 'ja',
                tocTitle: '目次',
                appendChapterTitles: false
            });
        })
    }
};