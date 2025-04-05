const { resolve } = require("path")

const parser = (req) =>{
    return new Promise((resolve, reject) => {
        let body = ""

        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", () => {
            try {
                const parsedData = JSON.parse(body)
                resolve(parsedData)
            } catch (error) {
                reject("Not valid data")
            }
        })
    })
}

module.exports = parser