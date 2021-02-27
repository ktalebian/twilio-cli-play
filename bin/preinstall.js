const os = require('os');
const which = require('which');
const { spawn } = require('child_process');

const success = Promise.resolve({ success: true });
const platform = os.platform();

const spawnCmd = (cmd, options, ...flags) => {
    return new Promise((resolve, reject) => {
        const script = spawn(cmd, [...flags, options]);


        script.stdout.on('data', (data) => {
            console.log(data.toString());
        });
          
        script.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    
        script.on('exit', (code) => {
            if (code) {
                reject(code);
            } else {
                resolve();
            }
        });
    });
} 

const hasCmd = (cmd) => {
    try {
        which.sync(cmd);
        return true;
    } catch (e) {
        return false;
    }
}

const preInstallNotSupported = (reason) => {
    return Promise.resolve({
        success: false,
        reason,
    });
}

const installExtension = async () => {
    const options = {
        env: { ...process.env, INSTALL_LOOP_TRANSFER: true }
    };
    return spawnCmd('twilio', options, 'plugins:install', '@k88/twilio-cli-play')
        .then(() => success);
};

const installTwilioCli = async () => {
    console.log('Installing Twilio CLI');

    const windows = () => {

    };

    const linux = () => {

    };

    const mac = () => {
        return spawnCmd('npm', {}, 'install', 'twilio-cli', '-g')
            .then(() => success);
    };

    switch (platform) {
        case 'win32': return windows(); 
        case 'linux': return linux();
        case 'darwin': return mac();
        default: Promise.resolve({ success: false, reason: `${platform} is not supported}`});
    }
};

const start = async () => {
    if (!hasCmd('npm')) {
        return preInstallNotSupported();
    }

    if (hasCmd('twilio')) {
        return installExtension();
    }

    return installTwilioCli()
        .then(installExtension);
}

// Internal loop of installing this
if (process.env.INSTALL_LOOP_TRANSFER) {
    return process.exit(0);
}

start()
    .then(result => {
        if (!result.success) {
            console.log('Cannot automatically install flex-plugins-cli because:', result.reason);
        }
    })
    .catch(e => {
        console.error('Failed to run npm install');
        console.error(e);
    });



