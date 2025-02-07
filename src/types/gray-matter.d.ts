declare module 'gray-matter' {
    interface GrayMatterResult<T extends object = object> {
        content: string;
        data: T;
        excerpt?: string;
        isEmpty: boolean;
        orig: string;
    }

    interface GrayMatterOption {
        excerpt?: boolean | ((file: string, options: Record<string, unknown>) => string | void);
        excerpt_separator?: string;
        engines?: Record<string, unknown>;
        language?: string;
    }

    function matter(
        str: string,
        options?: GrayMatterOption
    ): GrayMatterResult;

    export default matter;
}