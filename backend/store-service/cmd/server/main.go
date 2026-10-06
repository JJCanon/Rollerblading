package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"

	"github.com/cannon-jj18/rollerblading/store-service/internal/config"
	"github.com/cannon-jj18/rollerblading/store-service/internal/db"
)

func main() {
	cfg := config.Load()

	pool, err := db.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("could not connect to PostgreSQL: %v", err)
	}
	defer pool.Close()
	log.Println("Connection to PostgreSQL succeed")

	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "store-service"})
	})

	log.Printf("Store Service listening on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
