const IPFS = require('ipfs')
const Path = require('path')
const Fs   = require('fs')
const _    = require('lodash')

module.exports = plugin;

function plugin(options){
    return function(files, metalsmith, done){
    	let node = new IPFS();
    	let filesArray = _.map(files, (f)=>{
    		f.path = (f.path == '') ? 'index.html' : f.path;
    		return {
    			path : Path.join(options.path, f.path),
    			content : f.contents
    		};
    	});
    	node.on('ready', ()=>{
    		node.files.add(filesArray, (err, hashes) => {
    			let webSiteHash = _.find(hashes, (h) => { return "/"+ h.path == options.path;})
    			node.stop(()=>{
    				console.log('Web site Hash => '+ webSiteHash.hash);
    				setImmediate(done);
    			});
    		});
    	});
    }
}