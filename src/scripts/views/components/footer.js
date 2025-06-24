const Footer = {
    render() {
      const year = new Date().getFullYear();
      return `
        <footer class="footer" aria-label="Footer situs">
          <p>&copy; ${year} Web Story - Dibuat oleh Suparman dengan setulus hati </p>
        </footer>
      `;
    },
  };
  
  export default Footer;
  