
import {
	encodeDynamic,
	encodeStatic
} from './utils/codec.ts';
import { ABIParameter } from './utils/types.ts';


export class Param {
    public dynamicParam(arg: any, abi: ABIParameter): Uint8Array {
        return encodeDynamic(arg, abi);
    }

    public staticParam(arg: any, abi: ABIParameter): Uint8Array {
        return encodeStatic(arg, abi);
    }

    public getHex(buffer: Uint8Array): string {
        const end = buffer.length;
        const rounded = Math.ceil(end / 32) * 32;
        const view = buffer.slice(0, rounded);
        return (
            '0x' +
            Array.from(view)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
        );
    }

    ensureCapacity(newSize: number, buffer: Uint8Array): Uint8Array {
        if (buffer.length >= newSize) return buffer;

        const newBuffer = new Uint8Array(newSize);
        newBuffer.set(buffer);
        return newBuffer;
    }

    isDynamicType(params: ABIParameter): boolean {
        if (params.type === 'string' || params.type === 'bytes') return true;

        if (/\[\]$/.test(params.type)) return true;

        if (params.type === 'tuple') {
            if (!params.components) throw new Error('Tuple must have components');
            return params.components.some(this.isDynamicType);
        }

        return false;
    }
}