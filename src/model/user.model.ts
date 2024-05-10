export interface Users {
    id: number,
    name: string,
    email: string,
    password: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
}

export interface ReqUser {
    name: string,
    email: string,
    password: string,
    confirm_password: string|null,
}

export interface ReqLogin {
    email: string,
    password: string,
}