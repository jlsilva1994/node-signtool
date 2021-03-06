"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const child_process_1 = require("child_process");
/** Digitally signs files. */
function sign(file, options = { auto: true }, runOptions) {
    const args = ["sign"];
    if (options.auto)
        args.push("/a");
    if (options.append)
        args.push("/as");
    if (options.verify)
        args.push("/uw");
    if (!undef(options.certificate))
        args.push("/f", options.certificate);
    if (!undef(options.password))
        args.push("/p", options.password);
    if (!undef(options.issuer))
        args.push("/i", options.issuer);
    if (!undef(options.subject))
        args.push("/n", options.subject);
    if (!undef(options.rootSubject))
        args.push("/r", options.rootSubject);
    if (!undef(options.description))
        args.push("/d", options.description);
    if (!undef(options.url))
        args.push("/du", options.url);
    if (!undef(options.store))
        args.push("/s", options.store);
    if (options.computerStore)
        args.push("/sm");
    if (!undef(options.sha1))
        args.push("/sha1", options.sha1);
    if (!undef(options.csp))
        args.push("/csp", options.csp);
    if (!undef(options.key))
        args.push("/kc", options.key);
    if (!undef(options.template))
        args.push("/c", options.template);
    if (!undef(options.additional))
        args.push("/ac", options.additional);
    if (!undef(options.algorithm))
        args.push("/fd", options.algorithm);
    if (!undef(options.EKU))
        args.push("/u", options.EKU);
    if (!undef(options.timestamp))
        args.push("/t", options.timestamp);
    if (!undef(options.rfcTimestamp))
        args.push("/tr", options.rfcTimestamp);
    if (!undef(options.timestampAlgo))
        args.push("/td", options.timestampAlgo);
    if (!undef(options.digest)) {
        if (typeof options.digest === "boolean")
            args.push("/dg", ".");
        else
            args.push("/dg", options.digest);
        if (options.digestXML)
            args.push("/dxml");
        if (!undef(options.digestFunction))
            args.push("/dmdf", options.digestFunction);
    }
    if (!undef(options.digestLib))
        args.push("/dlib", options.digestLib);
    if (options.digestOnly)
        args.push("/ds");
    if (!undef(options.pkcs)) {
        args.push("/p7", options.pkcs);
        if (!undef(options.pkcsCE))
            args.push("/p7ce", options.pkcsCE);
        if (!undef(options.pkcsOID))
            args.push("/p7co", options.pkcsOID);
    }
    if (options.pageHashes)
        args.push("/ph");
    if (options.suppresPageHashes)
        args.push("/nph");
    Array.isArray(file) ?
        args.push(...file) :
        args.push(file);
    return run(args, runOptions);
}
exports.sign = sign;
/**
 * Verifies the digital signature of files.
 *
 * The SignTool verify command determines :
 * - whether the signing certificate was issued by a trusted authority,
 * - whether the signing certificate has been revoked,
 * - and, optionally, whether the signing certificate is valid for a specific policy.
 */
function verify(file, options = { useAllMethods: true }, runOptions) {
    const args = ["verify"];
    if (options.useAllMethods)
        args.push("/a");
    if (!undef(options.os))
        args.push("/o", options.os);
    if (!undef(options.index))
        args.push("/ds", options.index.toString());
    if (!undef(options.hash))
        args.push("/hash", options.hash);
    if (!undef(options.rootSubject))
        args.push("/r", options.rootSubject);
    if (!undef(options.catalogDatabase))
        args.push("/ag", options.catalogDatabase);
    if (!undef(options.catalogFile))
        args.push("/c", options.catalogFile);
    if (options.useDefaultCatalog)
        args.push("/ad");
    if (options.useDriverCatalog)
        args.push("/as");
    if (options.verifyAllSignatures)
        args.push("/all");
    if (options.useX64Kernel)
        args.push("/kp");
    if (options.useMultiSemantics)
        args.push("/ms");
    if (options.verifyPKCS)
        args.push("/p7");
    if (options.verifyPageHash)
        args.push("/ph");
    if (options.verifyTimestamp)
        args.push("/tw");
    if (options.defaultAuthPolicy)
        args.push("/pa");
    if (!undef(options.useAuthPolicy))
        args.push("/pg", options.useAuthPolicy);
    if (options.showDescription)
        args.push("/d");
    Array.isArray(file) ?
        args.push(...file) :
        args.push(file);
    return run(args, runOptions);
}
exports.verify = verify;
/** Time stamps files. */
function timestamp(file, options, runOptions) {
    const args = ["timestamp"];
    if (!undef(options.url))
        args.push("/t", options.url);
    if (!undef(options.rfcUrl))
        args.push("/tr", options.rfcUrl);
    if (!undef(options.sealUrl))
        args.push("/tseal", options.sealUrl);
    if (!undef(options.algorithm))
        args.push("/td", options.algorithm);
    if (!undef(options.index))
        args.push("/tp", options.index.toString());
    if (!undef(options.pkcs))
        args.push("/p7", options.pkcs);
    Array.isArray(file) ?
        args.push(...file) :
        args.push(file);
    return run(args, runOptions);
}
exports.timestamp = timestamp;
/** Adds or removes a catalog file to or from a catalog database. */
function catdb(file, options = {}, runOptions) {
    const args = ["catdb"];
    if (options.default)
        args.push("/d");
    if (!undef(options.guid))
        args.push("/g", options.guid);
    if (options.remove)
        args.push("/r");
    if (options.unique)
        args.push("/u");
    Array.isArray(file) ?
        args.push(...file) :
        args.push(file);
    return run(args, runOptions);
}
exports.catdb = catdb;
function run(args, options = {}) {
    return new Promise((resolve, reject) => {
        let cmd = signtool();
        if (process.platform !== "win32") {
            args.unshift(cmd);
            cmd = "wine";
        }
        if (options.debug)
            args.splice(1, 0, "/debug");
        if (options.verbose)
            args.splice(1, 0, "/v");
        if (options.quiet)
            args.splice(1, 0, "/q");
        const childOptions = {};
        if (!undef(options.cwd))
            childOptions.cwd = options.cwd;
        if (!undef(options.stdio))
            childOptions.stdio = options.stdio;
        const stdout = [], stderr = [], child = child_process_1.spawn(cmd, args, childOptions);
        child.stdout.on("data", data => { stdout.push(data); });
        child.stderr.on("data", data => { stderr.push(data); });
        child.on("error", reject);
        child.on("close", (code) => {
            if (code === 0) {
                return resolve({
                    code,
                    stdout: Buffer.concat(stdout).toString(),
                    stderr: Buffer.concat(stderr).toString()
                });
            }
            const err = new Error(`SignTool ${args[0]} command exited with code ${code}`);
            err.command = cmd;
            err.args = args;
            err.code = code;
            err.stdout = Buffer.concat(stdout).toString();
            err.stderr = Buffer.concat(stderr).toString();
            if (err.stderr) {
                err.message = err.message + "\n" + err.stderr;
            }
            reject(err);
        });
    });
}
function undef(val) {
    return typeof val === "undefined";
}
function signtool() {
    if (signtool.result)
        return signtool.result;
    const basePath = path.join(process.resourcesPath, "app.asar.unpacked", "node_modules", "@jlsilva94", "signtool")
    switch (process.arch) {
        case "ia32":
            return (signtool.result = path.join(basePath, "signtool", "x86", "signtool.exe"));
        case "x64":
            return (signtool.result = path.join(basePath, "signtool", "x64", "signtool.exe"));
        case "arm":
        default:
            throw new Error("Signtool is not supported in this environment");
    }
}
