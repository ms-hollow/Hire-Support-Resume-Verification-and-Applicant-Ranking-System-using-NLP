const env = process.env.NEXT_PUBLIC_NODE_ENV;

const apiBaseUrl =
    env === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : env === "development"
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_LOCAL_API_URL;

export default apiBaseUrl;
