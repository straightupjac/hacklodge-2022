/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import { verify, sign, checkIfVerifiedHandle } from "./utils/utils";
import metamask from "./utils/metamask.svg";
import coinbase from "./utils/coinbase.png"

const START_SIGN = 0;
const CONNECT_WALLET = 1;
const SIGN_MESSAGE = 2;
const VERIFY = 3;
const VERIFY_TWEET = 4;
const VERIFYING = 5;
const FINISH_SIGN = 6;

const SIGNING = 7;

const CloseButton = ({ handleClose }) => {
  return (
    <IconButton onClick={handleClose} sx={{
      position: 'absolute', right: 15, top: 15,
      background: 'rgba(196, 196, 196, 0.2)',
      height: 48, width: 48, borderRadius: 2,
    }}>
      <CloseIcon />
    </IconButton>
  )
}

const StartSign = ({ name, handle, alert, setName, setHandle, handleFormSubmit, buttonStyle }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Leave your <br /><span style={{ color: '#257C5E' }}>legacy</span>.
      </Typography>
      <TextField
        label="name"
        variant="outlined"
        value={name}
        required
        onInput={e => setName(e.target.value)}
      />
      <TextField
        label="twitter handle"
        variant="outlined"
        value={handle}
        onInput={e => setHandle(e.target.value)}
      />
      {alert && <Typography sx={{ fontSize: 10, color: 'red', textAlign: 'center' }}>
        {alert}
      </Typography>}
      <Button
        onClick={handleFormSubmit}
        variant="contained"
        size="large"
        sx={buttonStyle || styles.button}
      >
        Connect wallet to sign
      </Button>
    </Stack>
  )
}

const ConnectWallet = ({ alert, handleConnect }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Connect your <br /><span style={{ color: '#257C5E' }}>wallet</span>.
      </Typography>
      <Box onClick={() => handleConnect('coinbase')}
        sx={{
          cursor: 'pointer', borderBottom: '1px solid #eee',
          textAlign: 'center', py: 2,
          ':hover': { opacity: 0.8 },
        }}
      >
        <img
          src={coinbase}
          style={{ height: 50, width: 300 }}
          alt="login with Coinbase Wallet!"
        />
      </Box>
      <Box onClick={() => handleConnect('metamask')}
        sx={{
          cursor: 'pointer',
          textAlign: 'center',
          ':hover': { opacity: 0.8 },
        }}
      >
        <img
          src={metamask}
          style={{ height: 100, width: 300 }}
          alt="login with Metamask!"
        />
      </Box>
      {alert && <Typography sx={{ fontSize: 10, color: 'red', textAlign: 'center' }}>
        {alert}
      </Typography>}
    </Stack>
  )
}

const SignMessage = ({ alert, handleSign, buttonStyle }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Sign a <span style={{ color: '#257C5E' }}>message</span> with your wallet.
      </Typography>
      <Button
        onClick={handleSign}
        variant="contained"
        size="large"
        sx={buttonStyle || styles.button}
      >
        Sign message
      </Button>
      {alert && <Typography sx={{ fontSize: 10, color: 'red', textAlign: 'center' }}>
        {alert}
      </Typography>}
    </Stack>
  )
}

const Verify = ({ alert, handleTweet, handleWithoutVerifying, buttonStyle }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Verify your <span style={{ color: '#257C5E' }}>signature</span>.
      </Typography>
      <Typography sx={{ fontSize: 18, }}>Tweet a message to prove that you control this address. Return here afterwards to complete verification.</Typography>
      <Button onClick={handleTweet} startIcon={<TwitterIcon />}
        variant="contained"
        sx={buttonStyle || styles.button}
      >
        Post Proof
      </Button>
      {alert && <Typography sx={{ fontSize: 10, color: 'red', textAlign: 'center' }}>
        {alert}
      </Typography>}

      <Typography sx={{ fontSize: 12, textAlign: 'center' }} onClick={handleWithoutVerifying}>
        <a>
          Continue without verifying
        </a>
      </Typography>

    </Stack>
  )
}

const LoaderModal = ({ title }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <CircularProgress size="large" />
    </Stack>
  )
}

const VerifyTweet = ({ alert, handleTwitterVerifyAndSign, buttonStyle }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Complete <span style={{ color: '#257C5E' }}>verification</span>.
      </Typography>
      <Typography sx={{ fontSize: 18 }}>After sending your tweet, click the button below to complete verification:</Typography>
      <Button onClick={handleTwitterVerifyAndSign} startIcon={<TwitterIcon />}
        variant="contained"
        sx={buttonStyle || styles.button}
      >
        Verify Tweet</Button>
      {alert && <Typography sx={{ fontSize: 10, color: 'red', textAlign: 'center' }}>
        {alert}
      </Typography>}
    </Stack>
  )
}

const FinishSign = ({ buttonStyle }) => {
  const shareTweet = () => {
    const str = `I just built my digital legacy with @legacy_xyz. Build yours at web3legacy.xyz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(str)}`);
  }

  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        <span style={{ color: '#257C5E' }}>YOU</span> did it!
      </Typography>
      <Typography sx={{ fontSize: 20 }}>
        Thanks for signing and building your <span style={{ color: '#257C5E' }}>legacy</span>.
      </Typography>
      <Button onClick={shareTweet} startIcon={<TwitterIcon />}
        variant="contained"
        sx={buttonStyle || styles.button}
      >
        Share
      </Button>
    </Stack>
  )
}

export default function SignModal(props) {
  const { projectId, isModalVisible, handleClose, handleLoginClick, signFromWallet, account, active, buttonStyle, modalStyle } = props;
  const [state, setState] = useState(START_SIGN);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [alert, setAlert] = useState();
  const [signature, setSignature] = useState('');

  const handleFormSubmit = () => {
    if (name) {
      setAlert('');

      // make sure there are no white spaces
      setName(name.trim());
      setHandle(handle.trim());
      setState(CONNECT_WALLET);
    } else {
      setAlert('Name is required.');
    }
  };

  // connects to wallet
  const handleConnect = (provider) => {
    handleLoginClick(provider).then((res) => {
      setAlert('');
      setState(SIGN_MESSAGE);
    }).catch((err) => {
      setAlert('An error occured. Please try connecting your wallet again.');
    })
  }

  const handleSign = async () => {
    if (!active) {
      setAlert('Please connect your wallet first.');
      setState(CONNECT_WALLET);
      return;
    }
    signFromWallet(account, name, handle).then((sig) => {
      setSignature(sig);
    }).catch((err) => {
      setAlert('An error occurred. Please try signing again.');
    });
  }

  useEffect(() => {
    if (signature === '') return;
    setAlert('');
    checkIfVerifiedHandle(handle, signature).then((verified) => {
      if (verified) {
        handleWithoutVerifying();
      }
      else {
        setState(VERIFY);
      }
    })
  }, [signature])

  const generateTweet = () => {
    const str = `I'm building my digital legacy today. Verifying for @legacy_xyz signature:${signature}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(str)}`);
  }

  const handleTweet = () => {
    generateTweet();
    setState(VERIFY_TWEET);
  }

  const handleTwitterVerifyAndSign = () => {
    setState(VERIFYING);
    verify(signature, handle).then(() => { // verifying that they signed
      sign(projectId, name, account, handle, signature).then((result) => {
        setAlert('');
        setState(FINISH_SIGN);
      }).catch((err) => {
        setAlert("An error occurred with signing to the blockchain.");
        setState(VERIFY_TWEET);
      })
    }).catch((err) => {
      setAlert("An error occurred. Did you tweet a message?");
      setState(VERIFY);
    })
  }

  const handleWithoutVerifying = () => {
    setState(SIGNING);
    sign(projectId, name, account, handle, signature).then((result) => {
      setAlert('');
      setState(FINISH_SIGN);
    }).catch((err) => {
      setAlert("An error occurred with signing to the blockchain.");
      setState(VERIFY);
    });
  }

  return (
    <>
      <Modal
        open={isModalVisible}
        onClose={handleClose}
        onBackdropClick={handleClose}
      >
        <Box sx={modalStyle || {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 445,
          background: 'white',
          border: '0px',
          borderRadius: 10,
          boxShadow: 24,
          marginLeft: 'auto',
          marginRight: 'auto',
          p: 5,
        }}>
          <CloseButton handleClose={handleClose} />
          <Stack sx={{ pt: 2 }}>
            {state === START_SIGN && <StartSign name={name} handle={handle} alert={alert}
              setName={setName} setHandle={setHandle}
              handleFormSubmit={handleFormSubmit}
              buttonStyle={buttonStyle}
            />}
            {state === CONNECT_WALLET && <ConnectWallet alert={alert} handleConnect={handleConnect} />}
            {state === SIGN_MESSAGE && <SignMessage alert={alert} handleSign={handleSign} buttonStyle={buttonStyle} />}
            {state === VERIFY && <Verify alert={alert} handleTweet={handleTweet} handleWithoutVerifying={handleWithoutVerifying} buttonStyle={buttonStyle} />}
            {state === VERIFY_TWEET && <VerifyTweet alert={alert} handleTwitterVerifyAndSign={handleTwitterVerifyAndSign} buttonStyle={buttonStyle} />}
            {state === VERIFYING && <LoaderModal title="Verifying" />}
            {state === SIGNING && <LoaderModal title="Signing" />}
            {state === FINISH_SIGN && <FinishSign buttonStyle={buttonStyle} />}
            <Typography sx={{ fontSize: 12, textAlign: 'center', mt: 3 }}>
              🌱 Check out <a href="http://web3legacy.xyz/" target="_blank" style={{ textDecoration: 'none' }} rel="noreferrer"><span style={{ color: '#257C5E' }}>legacy</span></a> to learn more
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}

const styles = {
  button: {
    color: 'white',
    background: '#000000',
    textTransform: 'none',
    fontSize: 20,
    borderRadius: 3,
    ':hover': { background: '#000000', opacity: 0.8 }
  }
};
