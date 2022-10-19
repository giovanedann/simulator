package main

import (
	"fmt"
	"log"
	kafka2 "github.com/giovanedann/simulator/app/kafka"
	"github.com/giovanedann/simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
}

func main() {
	msgChannel := make(chan *ckafka.Message) // creating a channel to receive the messages
	consumer := kafka.NewKafkaConsumer(msgChannel) // creating a consumer to watch over the channel

	go consumer.Consume() // running the consumer in a sepparated thread

	// looping over the msgChannel to print the messages every time a new message arrives
	for msg := range msgChannel { 
		fmt.Println(string(msg.Value))
		go kafka2.Produce(msg)
	}
}