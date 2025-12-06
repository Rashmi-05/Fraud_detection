import { spawn } from "child_process";

const computeRisk = ( args = []) => {
    const scriptPath="./Scripts/testscript.py"
    return new Promise((resolve, reject) => {
        const process = spawn("python", [scriptPath, ...args]);

        let output = "";
        let errorOutput = "";

        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        process.on("close", (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(
                    new Error(
                        `Python script failed with exit code ${code}: ${errorOutput}`
                    )
                );
            }
        });
    });
};
export default computeRisk;