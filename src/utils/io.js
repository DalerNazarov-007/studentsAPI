const fs = require("node:fs/promises")

class IO {
    constructor(directory){
        this.directory = directory;
    }
    async read(){
        const data = await fs.readFile(this.directory, "utf-8")
        return data ? JSON.parse(data) : []
    }
    async write(data){
        await fs.writeFile(this.directory, JSON.stringify(data, null, 2), "utf-8")
        return {success: true}
    }
}

module.exports = IO