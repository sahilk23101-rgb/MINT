;; my-token contract
;; A simple fungible token implementation

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))

;; Data Variables
(define-data-var token-name (string-utf8 32) u"MyToken")
(define-data-var token-symbol (string-utf8 10) u"MTK")
(define-data-var token-uri (optional (string-utf8 256)) none)

;; Define the FT
(define-fungible-token my-token)

;; Public functions

;; Get token name
(define-read-only (get-name)
    (ok (var-get token-name)))

;; Get token symbol
(define-read-only (get-symbol)
    (ok (var-get token-symbol)))

;; Get token URI
(define-read-only (get-token-uri)
    (ok (var-get token-uri)))

;; Mint new tokens
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ft-mint? my-token amount recipient)))

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-owner-only)
        (ft-transfer? my-token amount sender recipient)))

;; Get balance
(define-read-only (get-balance (who principal))
    (ok (ft-get-balance my-token who)))
