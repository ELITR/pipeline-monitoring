import { exec } from "child_process"
import { promisify } from "util"

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {

    const async_exec = promisify(exec)
    try {
        const { stdout } = await async_exec(`ls -p ${query.get("dir")} | grep -v /`)
        return {
            body: stdout.split("\n").filter(d => d)
        }
    } catch (e) {

        return {
            body: []
        }
    }
}
