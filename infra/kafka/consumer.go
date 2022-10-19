package kafka

import (
	"os"
	"log"
	"fmt"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaConsumer struct {
	MsgChannel chan *ckafka.Message
}

func NewKafkaConsumer(msgChannel chan *ckafka.Message) *KafkaConsumer {
	return &KafkaConsumer{
		MsgChannel: msgChannel,
	}
}

func (k *KafkaConsumer) Consume() {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KafkaBootstrapServers"),
		"group.id": os.Getenv("KafkaConsumerGroupId"),
	}

	c, err := ckafka.NewConsumer(configMap)
	if err != nil {
		log.Fatalf("error consuming kafka message:" + err.Error())
	}

	topics := []string{os.Getenv("KafkaReadTopic")}
	c.SubscribeTopics(topics, nil)
	fmt.Println("Kafka consumer started")

	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			k.MsgChannel <- msg
		}
	}
}