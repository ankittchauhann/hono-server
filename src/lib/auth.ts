import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { openAPI } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

// Create MongoDB client and get database using the same connection as the main app
const mongoUri =
	process.env.MONGODB_URI ||
	"mongodb://root:123456@localhost:27018/TestDB?directConnection=true&authSource=admin&replicaSet=anya-rs";
const client = new MongoClient(mongoUri);
const db = client.db(); // Get the database from the client

// Connect to MongoDB
async function connectMongoDB() {
	try {
		await client.connect();
		console.log("Better Auth MongoDB client connected");
	} catch (error) {
		console.error("Better Auth MongoDB connection error:", error);
	}
}

// Initialize connection
connectMongoDB();

export const auth = betterAuth({
	secret:
		process.env.BETTER_AUTH_SECRET || "demo-secret-key-change-in-production",
	baseURL: "http://192.168.1.8:5005",
	logger: {
		level: "info",
	},
	database: mongodbAdapter(db),
	emailAndPassword: {
		enabled: true,
		// requireEmailVerification: false,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
			},
			isActive: {
				type: "boolean",
				required: false,
				defaultValue: true,
			},
		},
	},
	plugins: [openAPI(), reactStartCookies()],
	trustedOrigins: [
		// process.env.BETTER_AUTH_URL || "http://localhost:5005",
		// process.env.FRONTEND_URL || "http://localhost:3000",
		// "http://localhost:3000", // React default
		"http://localhost:5173", // Vite default
		// "http://127.0.0.1:3000",
		// "http://127.0.0.1:5173",
		// "http://localhost:8080", // Vue/Webpack default
		// "http://localhost:4200", // Angular default
		"http://192.168.1.29:5173",
		// "http://192.168.1.27:5173",
		"http://192.168.1.6:5173",

	],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
