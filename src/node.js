
    static load(path, encoding){
        return XML.parse(FS.readFileSync(path, encoding || 'utf-8'));
    }

    static save(path, content){
        FS.writeFileSync(path, typeof content == 'string' ? content : XML.stringify(content));
    }
