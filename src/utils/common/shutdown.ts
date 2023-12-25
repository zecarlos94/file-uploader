import { Server } from 'http';
import gracefulShutdown from 'http-graceful-shutdown';
import logger from 'src/logger/logger';

// This enables the graceful shutdown with advanced options
export default function addGracefulShutdown(
  server: Server,
  finalFunction?: () => void,
  preShutdownFunction?: () => Promise<void>,
  shutdownFunction?: () => Promise<void>,
  signals?: string,
  timeout?: number
) {
  if (!finalFunction) {
    finalFunction = () => { 
      logger.info('Server gracefully shutted down...');
    };
  }

  if (!preShutdownFunction) {
    preShutdownFunction = () => {
      logger.info('Server is now preparing shut down...');
      return Promise.resolve();
    };
  }

  if (!shutdownFunction) {
    shutdownFunction = () => {
      logger.info('Server is now shutting down...');
      return Promise.resolve();
    };
  }

  gracefulShutdown(server,
    {
      // If set to true, no graceful shutdown is proceeded to speed up dev-process
      development: false,               
      // Small, not time-consuming function, that will be handled at the end of the shutdown (not in dev-mode), e.g. for logging
      finally: finalFunction,           
      // Force process.exit - otherwise just let event loop clear
      forceExit: true,                  
      // Not time-consuming callback function. Needs to return a promise (async), e.g. for cleanup DB
      onShutdown: shutdownFunction,                
      // Not time-consuming callback function. Needs to return a promise. Here, all HTTP sockets are still available and untouched
      preShutdown: preShutdownFunction,            
      // Signals (SIGINT, SIGTERM, SIGKILL, SIGHUP, SIGUSR2, ...) that should be handled (separated by SPACE)
      // Please check https://man7.org/linux/man-pages/man7/signal.7.html for a listing of standard POSIX signal names.
      signals: signals ?? 'SIGHUP SIGINT SIGTERM', 
      // Timeout till forced shutdown (in milliseconds)
      timeout: timeout ?? 5000,                   
    }
  );
}