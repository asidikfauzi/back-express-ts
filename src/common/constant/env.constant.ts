//Environtment
export default {
    DATABASE_HOST : process.env.DATABASE_HOST ?? 'localhost',
    DATABASE_PORT : parseInt(process.env.DATABASE_PORT ?? "5432") ,
    DATABASE_USER : process.env.DATABASE_PORT ?? 'postgres',
    DATABASE_PASSWORD : process.env.DATABASE_PASSWORD ?? '1234',
    DATABASE_NAME : process.env.DATABASE_NAME ?? '1234',
}