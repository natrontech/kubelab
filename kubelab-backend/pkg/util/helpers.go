package util

import "strings"

var (
	SpecialCharacters string = "!@#$%^&*()_+-=[]{}|;':,./<>?`~"
)

func StringParser(s string) string {
	returnString := strings.ToLower(s)
	returnString = strings.Replace(returnString, " ", "-", -1)
	// remove special characters from returnString
	for _, c := range SpecialCharacters {
		returnString = strings.Replace(returnString, string(c), "", -1)
	}
	return returnString
}
