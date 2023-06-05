package constants

type KeySequence []byte

var (
	KeySeqBackspace = []byte{127}
	KeySeqDownArrow = []byte{27, 91, 66}
	KeySeqLinefeed  = []byte{13}
	KeySeqUpArrow   = []byte{27, 91, 65}
	KeySeqSigInt    = []byte{3}
	KeySeqEOF       = []byte{4}
)
