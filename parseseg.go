package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
    "encoding/json"
)

func main() {
    file, err := os.Open("/Users/aplulu/Desktop/vod/end60/1080p.m3u8")
    if err != nil {
        panic(err)
    }
    defer file.Close()

    type Segment struct {
        Index int `json:"index"`
        Duration float64 `json:"duration"`
    }

    var segments []Segment

    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        line := scanner.Text()

        if strings.HasPrefix(line, "#EXTINF:") {
            durationStr := strings.TrimPrefix(line, "#EXTINF:")
            durationStr = strings.Split(durationStr, ",")[0]
            duration, err := strconv.ParseFloat(durationStr, 64)
            if err != nil {
                panic(err)
            }

            if scanner.Scan() {
                fileName := scanner.Text()
                fmt.Printf("ファイル名: %s, Duration: %.3f\n", fileName, duration)

                segments = append(segments, Segment{
                    Index: len(segments),
                    Duration: duration,
                })

            }
        }
    }

    if err := scanner.Err(); err != nil {
        panic(err)
    }

    b, err := json.Marshal(segments)
    if err != nil {
        panic(err)
    }

    fmt.Println(string(b))
}
