export let PAGE_METADATA = Symbol('PAGE');

export function Page(): MethodDecorator {
	return <T>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
		Reflect.defineMetadata(PAGE_METADATA, true, descriptor.value!);

		return descriptor;
	};
}
