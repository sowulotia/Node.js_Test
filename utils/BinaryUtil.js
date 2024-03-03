
class BinaryUtil{
	constructor(){

	}
	get_method_info(type, endian="le"){
		let Methods;
		if(endian.toUpperCase() == "LE"){
			Methods = {
				uint8:  {size: 1, method:'UInt8'},
				uint16: {size: 2, method:'UInt16LE'},
				uint32: {size: 4, method:'UInt32LE'},
				int8: 	{size: 1, method:'Int8'},
				int16:  {size: 2, method:'Int16LE'},
				int32:  {size: 4, method:'Int32LE'},
				float:  {size: 4, method:'FloatLE'},
				double: {size: 8, method:'DoubleLE'},
			};
		}
		else if(endian.toUpperCase() == "BE"){
			Methods = {
				uint8:  {size: 1, method:'UInt8'},
				uint16: {size: 2, method:'UInt16BE'},
				uint32: {size: 4, method:'UInt32BE'},
				int8: 	{size: 1, method:'Int8'},
				int16:  {size: 2, method:'Int16BE'},
				int32:  {size: 4, method:'Int32BE'},
				float:  {size: 4, method:'FloatBE'},
				double: {size: 8, method:'DoubleBE'},
			};
		}
		else {
			throw new Error(`endian is wrong [le, LE, be, BE] : ${endian}`);
		}
		return Methods[type];
	}
	
	num2bin(values, type='int32', endian='le'){
		let method_info = this.get_method_info(type, endian);
		let bufferSize = method_info.size;
		let method_name = 'write' + method_info.method;

		if(!bufferSize){
			throw new Error('Type Error')
		}

		// Check values is number or list. Here, Method only use the list of number
		let num_list;
		if (Array.isArray(values)){
			num_list = values;
		}
		else if(values instanceof Buffer){
			throw new Error('No support values type Error');
		}
		else{
			num_list = [values];
		}

		const totalBufferSize = num_list.length * bufferSize;
  		const buffer = Buffer.allocUnsafe(totalBufferSize);
		for (let i = 0; i < num_list.length; i++) {
			buffer[method_name](num_list[i], i * bufferSize);
		}

		return buffer;
	}

	bin2num(values, type='int32', endian='le'){
		let method_info = this.get_method_info(type, endian);
		let bufferSize = method_info.size;
		let method_name = 'read' + method_info.method;

		if(!bufferSize){
			throw new Error('Type Error')
		}
		
		let buffer;
		const result_array = [];
		if (Array.isArray(values)){
			buffer = Buffer.from(values);
		}
		else if(values instanceof Buffer){
			buffer = values;
		}
		else{
			throw new Error('No support values type Error')
		}

		for (let i = 0; i < buffer.length; i += bufferSize) {
			const typeBuffer = Buffer.concat([buffer.slice(i, i + bufferSize)]);
			const typeValue = typeBuffer[method_name](0);
        	result_array.push(typeValue);
		}

		return result_array;
	}
};

module.exports = BinaryUtil;