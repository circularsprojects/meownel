interface Instance {
    name: string;
    display_name: string;
    node: string;
    image: string;
    created_at?: Date;
    config_path?: string;
    running?: boolean;
    tags?: string[];
}