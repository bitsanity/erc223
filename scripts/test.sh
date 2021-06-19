#!/bin/bash

TESTACCTA="0x8c34f41f1cf2dfe2c28b1ce7808031c40ce26d38"
TESTACCTB="0x147b61187f3f16583ac77060cbc4f711ae6c9349"
TESTPVTA="0x0bce878dba9cce506e81da71bb00558d1684979711cf2833bab06388f715c01a"
TESTPVTB="0xff7da9b82a2bd5d76352b9c385295a430d2ea8f9f6f405a7ced42a5b0e73aad7"

TOK="0xf68580c3263fb98c6eaee7164afd45ecf6189ebb"
STUB="0x4ebf4321a360533ac2d48a713b8f18d341210078"

echo CONFIRM is ganache running from a fresh start?:
read -p '[N/y]: ' ans
if [[ $ans != "y" && $ans != "Y" ]]; then
  echo ""
  echo Please run the following before this:
  echo ""
  echo -n ganache-cli ""
  echo -n --account=\"$TESTPVTA,100000000000000000000\" ""
  echo -n --account=\"$TESTPVTB,100000000000000000000\" ""
  echo ""
  exit
fi

echo
echo ============
echo Deploy Token
echo ============
echo

node ./cli.js 0 0 deploy 18 "Test Token" TST

echo
echo ===========
echo Deploy Stub
echo ===========
echo

node deployStub.js

echo
echo ===================
echo Mine one full token
echo ===================
echo

node cli.js 0 $TOK mine 1000000000000000000 $TESTACCTB
echo
node cli.js 0 $TOK events
echo

echo Variables --------------------------------------
node cli.js 0 $TOK variables

echo
echo ========================
echo Balance of test accounts
echo ========================
echo

node cli.js 0 $TOK balanceOf $TESTACCTA
node cli.js 0 $TOK balanceOf $TESTACCTB

echo
echo ====================================
echo Burn half a token and show variables
echo ====================================
echo

node cli.js 1 $TOK burn 500000000000000000
echo
node cli.js 0 $TOK variables
echo
node cli.js 0 $TOK balanceOf $TESTACCTB

echo
echo ============================================
echo Should FAIL: Try to burn tokens you dont own
echo ============================================

node cli.js 0 $TOK burn 1

echo
echo ========================================
echo B approves 2 tokens for A, A burns one
echo ========================================
echo

node cli.js 1 $TOK approve $TESTACCTA 1
node cli.js 1 $TOK safeApprove $TESTACCTA 1 2
node cli.js 0 $TOK allowance $TESTACCTB $TESTACCTA
echo
node cli.js 0 $TOK burnFrom $TESTACCTB 1
echo
node cli.js 0 $TOK balanceOf $TESTACCTA
node cli.js 0 $TOK balanceOf $TESTACCTB

echo
echo ================================================
echo Should FAIL: A tries to burn 1 more than allowed
echo ================================================
echo

node cli.js 0 $TOK burnFrom $TESTACCTB 2
echo
node cli.js 0 $TOK allowance $TESTACCTB $TESTACCTA

echo
echo =============================================
echo A does a transferFrom to get the other token
echo =============================================

node cli.js 0 $TOK transferFrom $TESTACCTB $TESTACCTA 1
echo
node cli.js 0 $TOK balanceOf $TESTACCTA
node cli.js 0 $TOK balanceOf $TESTACCTB
echo

echo
echo ===============================================
echo B does approveAndCall on a stub smart contract
echo ===============================================

node cli.js 1 $TOK approveAndCall $STUB 1 "0x48656C6C6F"
node cli.js 0 $TOK allowance $TESTACCTB $STUB

echo
echo ===========================================
echo B does a ERC223 transfer to custom fallback
echo ===========================================

node cli.js 1 $TOK transferAndCall $STUB 1 "0x42" "customFallback(address,uint256,bytes)"

echo
echo ==============================================================
echo B does a ERC223 transfer to a contract and calls tokenFallback
echo ==============================================================

node cli.js 1 $TOK transferWithData $STUB 1 "0x69"
node cli.js 0 $TOK balanceOf $STUB

echo
echo =====================================
echo B does a transfer with data to an EOA
echo =====================================

node cli.js 1 $TOK transferWithData $TESTACCTA 1 "0x99"
node cli.js 0 $TOK balanceOf $TESTACCTA

echo
echo ======================================
echo B does a plain old ERC20 transfer to A
echo ======================================

node cli.js 1 $TOK transfer $TESTACCTA 1
node cli.js 0 $TOK balanceOf $TESTACCTA

echo
echo ===========================
echo Events on the stub contract
echo ===========================

node stubEvents.js $STUB

echo
echo ============================
echo Events on the token contract
echo ============================
echo
node cli.js 0 $TOK events
echo

