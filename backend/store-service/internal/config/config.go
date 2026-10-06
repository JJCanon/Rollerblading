package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
}

func Load() Config {
	_ = godotenv.Load()
	cfg := Config{
		Port:        getEnv("PORT", "3004"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
	}
	if cfg.DatabaseURL == "" || cfg.JWTSecret == "" {
		log.Fatal("missing required env vars: DATABASE_URL, JWT_SECRET")
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
