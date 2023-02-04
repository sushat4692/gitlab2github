import pino from "pino";

export const useLogger = () => {
    return pino({
        level: "trace",
        transport: {
            target: "pino/file",
            options: {
                destination: "logs/out.log",
                mkdir: true,
            },
        },
    });
};
